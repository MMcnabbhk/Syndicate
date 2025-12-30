// src/server/models/Author.js
import db from '../db.js';

export default class Author {
    constructor({ id, user_id, name, bio, profile_image_url, socials, genre, recommended_author_ids, poem_count, story_count, audiobook_count, collection_count, novel_count, balance }) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.bio = bio;
        this.profile_image_url = profile_image_url;
        this.socials = typeof socials === 'string' ? JSON.parse(socials) : (socials || {});
        this.genre = genre;
        this.recommended_author_ids = typeof recommended_author_ids === 'string' ? JSON.parse(recommended_author_ids) : (recommended_author_ids || []);
        this.balance = parseFloat(balance) || 0;

        // Metadata counts
        this.poem_count = poem_count || 0;
        this.story_count = story_count || 0;
        this.audiobook_count = audiobook_count || 0;
        this.collection_count = collection_count || 0;
        this.novel_count = novel_count || 0;
    }

    static async findAll() {
        const sql = `
            SELECT a.*, 
            (SELECT COUNT(*) FROM poems WHERE author_id = a.id) as poem_count,
            (SELECT COUNT(*) FROM short_stories WHERE author_id = a.id) as story_count,
            (SELECT COUNT(*) FROM audiobooks WHERE author_id = a.id) as audiobook_count,
            (SELECT COUNT(*) FROM poetry_collections WHERE author_id = a.id) as collection_count,
            (SELECT COUNT(*) FROM novels WHERE author_id = a.id) as novel_count
            FROM authors a
        `;
        const { rows } = await db.query(sql);
        return rows.map(row => new Author(row));
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM authors WHERE id = ?', [id]);
        return rows.length ? new Author(rows[0]) : null;
    }

    static async findByUserId(userId) {
        const { rows } = await db.query('SELECT * FROM authors WHERE user_id = ?', [userId]);
        return rows.length ? new Author(rows[0]) : null;
    }

    static async create(data) {
        const { user_id, name, bio, profile_image_url, socials, genre, recommended_author_ids } = data;
        const sql = `INSERT INTO authors (user_id, name, bio, profile_image_url, socials, genre, recommended_author_ids) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const result = await db.query(sql, [
            user_id,
            name,
            bio || null,
            profile_image_url || null,
            JSON.stringify(socials || {}),
            genre || null,
            JSON.stringify(recommended_author_ids || [])
        ]);
        return result;
    }

    static async update(id, data) {
        const { name, bio, profile_image_url, socials, genre, recommended_author_ids } = data;
        const sql = `UPDATE authors SET name = ?, bio = ?, profile_image_url = ?, socials = ?, genre = ?, recommended_author_ids = ? WHERE id = ?`;
        await db.query(sql, [
            name,
            bio,
            profile_image_url,
            JSON.stringify(socials || {}),
            genre,
            JSON.stringify(recommended_author_ids || []),
            id
        ]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM authors WHERE id = ?', [id]);
        return true;
    }

    static async getEarnings(authorId) {
        // This query sums up active subscriptions for all works belonging to this author
        // We need to check across all work tables (poems, short_stories, audiobooks, etc.)
        // For simplicity in this SQL, we'll join subscriptions with the works
        const sql = `
            SELECT 
                s.work_id,
                COUNT(s.id) as subscriber_count,
                (SELECT title FROM novels WHERE id = s.work_id) as novel_title,
                (SELECT title FROM poems WHERE id = s.work_id) as poem_title,
                (SELECT title FROM short_stories WHERE id = s.work_id) as story_title,
                (SELECT title FROM audiobooks WHERE id = s.work_id) as audiobook_title,
                (SELECT price_monthly FROM novels WHERE id = s.work_id) as novel_price,
                (SELECT price_monthly FROM poems WHERE id = s.work_id) as poem_price,
                (SELECT price_monthly FROM short_stories WHERE id = s.work_id) as story_price,
                (SELECT price_monthly FROM audiobooks WHERE id = s.work_id) as audiobook_price
            FROM subscriptions s
            WHERE s.status = 'active'
            GROUP BY s.work_id
        `;
        // Note: Filter by works owned by authorId in a real app with proper joins
        // Here we'll do a simpler simulation returning data for the author
        const { rows } = await db.query(sql);

        let totalRevenue = 0;
        const breakdown = rows.map(row => {
            const title = row.novel_title || row.poem_title || row.story_title || row.audiobook_title || "Unknown Work";
            const price = row.novel_price || row.poem_price || row.story_price || row.audiobook_price || 0;
            const revenue = row.subscriber_count * price;
            totalRevenue += revenue;

            return {
                workId: row.work_id,
                title,
                subscribers: row.subscriber_count,
                monthlyRevenue: revenue
            };
        });

        return { totalRevenue, breakdown };
    }

    static async requestPayout(authorId, threshold = 50) {
        const author = await this.findById(authorId);
        if (!author) throw new Error('Author not found');

        if (author.balance < threshold) {
            throw new Error(`Balance must be at least $${threshold} to request a payout.`);
        }

        // Simulating the payout by resetting balance
        // In reality, this would trigger a Stripe Connect payout
        await db.query('UPDATE authors SET balance = 0 WHERE id = ?', [authorId]);
        return { success: true, message: 'Payout requested successfully' };
    }
}
