import { Router } from 'express';
import multer from 'multer';
import { parse as parseCsv } from 'csv-parse/sync';
import vCard from 'vcf';
import User from '../models/User.js';
import db from '../db.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import crypto from 'crypto';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// Helper: Match emails to existing users
async function matchContacts(contacts) {
    if (!contacts.length) return [];

    // Extract emails
    const emails = contacts.map(c => c.email).filter(Boolean);
    if (!emails.length) return contacts.map(c => ({ ...c, isUser: false }));

    // Find users with these emails
    const placeholders = emails.map(() => '?').join(',');
    const sql = `SELECT email, id, name as display_name, handle FROM users WHERE email IN (${placeholders})`;

    // Since we don't have a bulk find by email in the model yet, we can use the db directly or a loop (not efficient)
    // For now, let's assume we can query directly or add a method to User.
    // Let's use the DB directly for this specialized query.
    const { rows } = await db.query(sql, emails);

    const userMap = new Map();
    rows.forEach(r => userMap.set(r.email.toLowerCase(), r));

    return contacts.map(c => {
        const user = c.email ? userMap.get(c.email.toLowerCase()) : null;
        return {
            ...c,
            isUser: !!user,
            userId: user ? user.id : null,
            handle: user ? user.handle : null
        };
    });
}

// Helper: Encrypt and store contacts
async function saveContacts(ownerId, contacts, source) {
    if (!contacts.length) return;

    for (const contact of contacts) {
        if (!contact.email) continue;

        const email = contact.email.toLowerCase().trim();
        const emailHash = crypto.createHash('sha256').update(email).digest('hex');
        const encryptedEmail = encrypt(email);
        const encryptedName = encrypt(contact.name || 'Unnamed');

        const sql = `
            INSERT INTO creator_contacts (owner_id, encrypted_email, encrypted_name, source, email_hash)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                encrypted_name = VALUES(encrypted_name),
                encrypted_email = VALUES(encrypted_email)
        `;
        await db.query(sql, [ownerId, encryptedEmail, encryptedName, source, emailHash]);
    }
}

// Get Stored Contacts
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const sql = 'SELECT * FROM creator_contacts WHERE owner_id = ?';
        const { rows } = await db.query(sql, [req.user.id]);

        const contacts = rows.map(r => ({
            id: r.id,
            name: decrypt(r.encrypted_name),
            email: decrypt(r.encrypted_email),
            source: r.source,
            createdAt: r.created_at
        }));

        const matchedContacts = await matchContacts(contacts);
        res.json(matchedContacts);
    } catch (err) {
        console.error('Fetch contacts error:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Upload CSV/VCF Contacts
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const fileContent = req.file.buffer.toString();
        let contacts = [];
        let source = req.file.originalname.endsWith('.vcf') ? 'vCard' : 'CSV';

        if (req.file.originalname.endsWith('.vcf')) {
            const cards = vCard.parse(fileContent);
            contacts = (Array.isArray(cards) ? cards : [cards]).map(card => {
                const name = card.get('fn')?.valueOf() || 'Unnamed';
                const email = card.get('email')?.valueOf();
                return { name, email };
            });
        } else if (req.file.originalname.endsWith('.csv')) {
            const records = parseCsv(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
            contacts = records.map(r => ({
                name: r.Name || r['First Name'] || r.DisplayName || 'Unnamed',
                email: r.Email || r['E-mail Address'] || r['Email Address']
            }));
        } else {
            return res.status(400).json({ error: 'Unsupported file format' });
        }

        await saveContacts(req.user.id, contacts, source);
        const matchedContacts = await matchContacts(contacts);
        res.json(matchedContacts);
    } catch (err) {
        console.error('Contact upload error:', err);
        res.status(500).json({ error: 'Failed to process contacts' });
    }
});

// Fetch Google Contacts
router.get('/google', isAuthenticated, async (req, res) => {
    try {
        const token = req.user.accessToken;
        if (!token) return res.status(401).json({ error: 'No Google access token found' });

        const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch Google contacts');
        const data = await response.json();

        const contacts = (data.connections || []).map(conn => ({
            name: conn.names?.[0]?.displayName || 'Unnamed',
            email: conn.emailAddresses?.[0]?.value
        })).filter(c => c.email);

        await saveContacts(req.user.id, contacts, 'Google');
        const matchedContacts = await matchContacts(contacts);
        res.json(matchedContacts);
    } catch (err) {
        console.error('Google contacts error:', err);
        res.status(500).json({ error: 'Failed to fetch Google contacts' });
    }
});

// Fetch Microsoft Contacts
router.get('/microsoft', isAuthenticated, async (req, res) => {
    try {
        const token = req.user.accessToken;
        if (!token) return res.status(401).json({ error: 'No Microsoft access token found' });

        const response = await fetch('https://graph.microsoft.com/v1.0/me/contacts?$select=displayName,emailAddresses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch Microsoft contacts');
        const data = await response.json();

        const contacts = (data.value || []).map(entry => ({
            name: entry.displayName || 'Unnamed',
            email: entry.emailAddresses?.[0]?.address
        })).filter(c => c.email);

        await saveContacts(req.user.id, contacts, 'Microsoft');
        const matchedContacts = await matchContacts(contacts);
        res.json(matchedContacts);
    } catch (err) {
        console.error('Microsoft contacts error:', err);
        res.status(500).json({ error: 'Failed to fetch Microsoft contacts' });
    }
});

export default router;
