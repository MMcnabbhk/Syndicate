import { Router } from 'express';
import db from '../db.js';
import Author from '../models/Author.js';
import { decrypt } from '../utils/encryption.js';

const router = Router();

// Middleware to ensure author
const isAuthor = async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const author = await Author.findByUserId(req.user.id);
    if (!author) return res.status(403).json({ error: 'Author profile required' });
    req.author = author;
    next();
};

// GET /api/invites/templates
router.get('/templates', isAuthor, async (req, res) => {
    try {
        const sql = 'SELECT * FROM creator_invite_templates WHERE creator_id = ?';
        const { rows } = await db.query(sql, [req.author.id]);
        res.json(rows[0] || {
            invite_text: "Hi! I've moved my creative works to Syndicate. It's a place where I can post my art, without a algorithm deciding if you're allowed to see it. My work and the work of other creators is free to consume. We don't have to pay Mr.Bezos or Mr. Zuckerberg to connect with each other. The site tag line \"Create. Share. Save Humanity,\" expresses what it is about. Here is a link to my work $link. Take care.",
            reminder1_text: 'Just a quick reminder about the invite I sent earlier!',
            reminder2_text: 'Last chance to join me on Syndicate and see what I am building!'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// POST /api/invites/templates
router.post('/templates', isAuthor, async (req, res) => {
    const { invite_text, reminder1_text, reminder2_text } = req.body;
    try {
        const sql = `
            INSERT INTO creator_invite_templates (creator_id, invite_text, reminder1_text, reminder2_text)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                invite_text = VALUES(invite_text),
                reminder1_text = VALUES(reminder1_text),
                reminder2_text = VALUES(reminder2_text)
        `;
        await db.query(sql, [req.author.id, invite_text, reminder1_text, reminder2_text]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save templates' });
    }
});

// GET /api/invites/list
router.get('/list', isAuthor, async (req, res) => {
    try {
        const sql = 'SELECT * FROM creator_invites WHERE creator_id = ? ORDER BY created_at DESC';
        const { rows } = await db.query(sql, [req.author.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch invite list' });
    }
});

// POST /api/invites/add (Add from contacts)
router.post('/add', isAuthor, async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        // Fetch the invite template
        const templateSql = 'SELECT invite_text FROM creator_invite_templates WHERE creator_id = ?';
        const { rows: templateRows } = await db.query(templateSql, [req.author.id]);

        let inviteText = 'Hi! I thought you might like to check out my work on Syndicate.';
        if (templateRows.length > 0) {
            inviteText = templateRows[0].invite_text;
        } else {
            // Use default template
            inviteText = "Hi! I've moved my creative works to Syndicate. It's a place where I can post my art, without a algorithm deciding if you're allowed to see it. My work and the work of other creators is free to consume. We don't have to pay Mr.Bezos or Mr. Zuckerberg to connect with each other. The site tag line \"Create. Share. Save Humanity,\" expresses what it is about. Here is a link to my work $link. Take care.";
        }

        // Replace $link with actual author profile URL
        const authorProfileUrl = `http://localhost:5173/author/${req.author.id}`;
        const finalInviteText = inviteText.replace(/\$link/g, authorProfileUrl);

        const sql = `
            INSERT INTO creator_invites (creator_id, email, name, status)
            VALUES (?, ?, ?, 'sent')
            ON DUPLICATE KEY UPDATE status = status
        `;
        // In a real system, this would send an email with finalInviteText
        // For now, we just log it to demonstrate the replacement works
        console.log('Invite email would contain:', finalInviteText);

        await db.query(sql, [req.author.id, email, name || null]);

        // Update sent timestamp if it was a new insert
        await db.query('UPDATE creator_invites SET invite_sent_at = NOW() WHERE creator_id = ? AND email = ? AND invite_sent_at IS NULL', [req.author.id, email]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add invite' });
    }
});

// DELETE /api/invites/templates/reset
router.delete('/templates/reset', isAuthor, async (req, res) => {
    try {
        await db.query('DELETE FROM creator_invite_templates WHERE creator_id = ?', [req.author.id]);
        res.json({ success: true, message: 'Templates reset to defaults' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reset templates' });
    }
});

export default router;
