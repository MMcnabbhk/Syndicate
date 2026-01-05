import db from '../db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.magic_token = data.magic_token;
        this.magic_expires = data.magic_expires;
        this.name = data.name;
        this.handle = data.handle;
        this.bio = data.bio;
        this.cover_image_url = data.cover_image_url;
        this.role = data.role || 'reader';
        this.status = data.status || 'active';
        this.wallet_balance = data.wallet_balance;
        this.oauth_provider = data.oauth_provider;
        this.oauth_id = data.oauth_id;
        this.created_at = data.created_at;

        // Statistics
        this.works_count = data.works_count || 0;
        this.contributors_count = data.contributors_count || 0;
        this.fans_count = data.fans_count || 0;
        this.author_balance = data.author_balance || 0;

        // Aliases for compatibility
        this.display_name = data.name;
        this.avatar_url = data.cover_image_url;
    }

    async verifyPassword(password) {
        if (!this.password_hash) return false;
        return bcrypt.compare(password, this.password_hash);
    }

    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    toPublic() {
        return {
            id: this.id,
            email: this.email,
            display_name: this.name,
            handle: this.handle,
            avatar_url: this.cover_image_url,
            role: this.role,
            status: this.status,
            created_at: this.created_at,
            works_count: this.works_count,
            contributors_count: this.contributors_count,
            fans_count: this.fans_count,
            author_balance: this.author_balance
        };
    }

    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const { rows } = await db.query(sql, [id]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const { rows } = await db.query(sql, [email]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findByGoogleId(googleId) {
        const sql = 'SELECT * FROM users WHERE oauth_provider = "google" AND oauth_id = ?';
        const { rows } = await db.query(sql, [googleId]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findByMicrosoftId(microsoftId) {
        const sql = 'SELECT * FROM users WHERE oauth_provider = "microsoft" AND oauth_id = ?';
        const { rows } = await db.query(sql, [microsoftId]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findByAppleId(appleId) {
        const sql = 'SELECT * FROM users WHERE oauth_provider = "apple" AND oauth_id = ?';
        const { rows } = await db.query(sql, [appleId]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async create({ email, password = null, name = null, handle = null, role = 'reader', oauthProvider = null, oauthId = null, avatarUrl = null, signupCreatorId = null }) {
        let passwordHash = null;
        if (password) {
            passwordHash = await this.hashPassword(password);
        }

        const id = crypto.randomUUID();
        const sql = `
            INSERT INTO users (id, email, password_hash, name, handle, role, oauth_provider, oauth_id, cover_image_url, signup_creator_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(sql, [id, email, passwordHash, name, handle, role, oauthProvider, oauthId, avatarUrl, signupCreatorId]);

        return this.findById(id);
    }

    static async setMagicToken(email, token, expires) {
        const sql = 'UPDATE users SET magic_token = ?, magic_expires = ? WHERE email = ?';
        await db.query(sql, [token, expires, email]);
    }

    static async findByMagicToken(token) {
        const sql = 'SELECT * FROM users WHERE magic_token = ? AND magic_expires > NOW()';
        const { rows } = await db.query(sql, [token]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findAll() {
        const sql = `
            SELECT 
                u.*,
                (SELECT COUNT(*) FROM authors WHERE user_id = u.id) as author_exists,
                COALESCE((SELECT balance FROM authors WHERE user_id = u.id), 0) as author_balance,
                (
                    SELECT COUNT(*) FROM novels WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                ) + (
                    SELECT COUNT(*) FROM poems WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                ) + (
                    SELECT COUNT(*) FROM short_stories WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                ) + (
                    SELECT COUNT(*) FROM audiobooks WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                ) as works_count,
                (
                    SELECT COUNT(DISTINCT user_id) 
                    FROM subscriptions 
                    WHERE work_id IN (
                        SELECT id FROM novels WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                        UNION SELECT id FROM poems WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                        UNION SELECT id FROM short_stories WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                        UNION SELECT id FROM audiobooks WHERE author_id IN (SELECT id FROM authors WHERE user_id = u.id)
                    ) AND status = 'active'
                ) as contributors_count,
                (
                    SELECT COUNT(*) 
                    FROM creator_contacts 
                    WHERE owner_id = (SELECT id FROM authors WHERE user_id = u.id)
                ) as fans_count
            FROM users u
            ORDER BY u.created_at DESC
        `;
        const { rows } = await db.query(sql);
        return rows.map(row => new User(row));
    }

    static async update(userId, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setters = fields.map(f => `${f} = ?`).join(', ');
        const sql = `UPDATE users SET ${setters} WHERE id = ?`;
        await db.query(sql, [...values, userId]);
        return this.findById(userId);
    }

    static async delete(userId) {
        const sql = 'DELETE FROM users WHERE id = ?';
        await db.query(sql, [userId]);
    }
}

export default User;
