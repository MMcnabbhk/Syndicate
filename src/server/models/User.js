import db from '../db.js';

class User {
    constructor(data) {
        this.id = data.id;
        this.google_id = data.google_id;
        this.microsoft_id = data.microsoft_id;
        this.apple_id = data.apple_id;
        this.email = data.email;
        this.display_name = data.display_name;
        this.avatar_url = data.avatar_url;
        this.role = data.role || 'reader';
        this.created_at = data.created_at;
    }

    static async createTableIfNotExists() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                google_id VARCHAR(255) UNIQUE,
                microsoft_id VARCHAR(255) UNIQUE,
                apple_id VARCHAR(255) UNIQUE,
                email VARCHAR(255) UNIQUE,
                display_name VARCHAR(255),
                avatar_url TEXT,
                role ENUM('reader', 'creator') DEFAULT 'reader',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.query(sql);

        // Basic migration attempt to ensure columns exist if table was already created
        try {
            await db.query("ALTER TABLE users ADD COLUMN microsoft_id VARCHAR(255) UNIQUE");
        } catch (e) { /* ignore if exists */ }
        try {
            await db.query("ALTER TABLE users ADD COLUMN apple_id VARCHAR(255) UNIQUE");
        } catch (e) { /* ignore if exists */ }
    }

    static async findByGoogleId(googleId) {
        const sql = 'SELECT * FROM users WHERE google_id = ?';
        const { rows } = await db.query(sql, [googleId]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findByMicrosoftId(microsoftId) {
        const sql = 'SELECT * FROM users WHERE microsoft_id = ?';
        const { rows } = await db.query(sql, [microsoftId]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findByAppleId(appleId) {
        const sql = 'SELECT * FROM users WHERE apple_id = ?';
        const { rows } = await db.query(sql, [appleId]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const { rows } = await db.query(sql, [id]);
        return rows.length ? new User(rows[0]) : null;
    }

    static async create({ googleId, microsoftId, appleId, email, displayName, avatarUrl, role = 'reader' }) {
        const sql = `
            INSERT INTO users (google_id, microsoft_id, apple_id, email, display_name, avatar_url, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [googleId, microsoftId, appleId, email, displayName, avatarUrl, role]);
        // result usually has insertId for mysql2
        try {
            // For mysql2/promise execute result is [resultHeader, fields]
            const insertId = result.rows.insertId;
            return new User({
                id: insertId,
                google_id: googleId,
                microsoft_id: microsoftId,
                apple_id: appleId,
                email: email,
                display_name: displayName,
                avatar_url: avatarUrl,
                role: role,
                created_at: new Date() // Approximate
            });
        } catch (e) {
            console.error("Error creating user object after insert:", e);
            throw e;
        }
    }
}

export default User;
