// src/server/models/VisualArt.js
import db from '../db.js';

export default class VisualArt {
    constructor({ id, author_id, title, description, cover_image_url, status, published_at, price_monthly, subscribers_count, lifetime_earnings, genre, display_order }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.description = description;
        this.cover_image_url = cover_image_url;
        this.status = status;
        this.published_at = published_at;
        this.price_monthly = price_monthly || 0;
        this.subscribers_count = subscribers_count || 0;
        this.lifetime_earnings = lifetime_earnings || 0;
        this.genre = genre || null;
        this.display_order = display_order || 0;
    }

    static async findAll() {
        try {
            const { rows } = await db.query('SELECT * FROM visual_arts ORDER BY display_order ASC, published_at DESC');
            return rows.map(row => new VisualArt(row));
        } catch (err) {
            console.error("Database error in VisualArt.findAll:", err.message);
            return [];
        }
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM visual_arts WHERE id = ?', [id]);
        return rows.length ? new VisualArt(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, description, cover_image_url, status, price_monthly, genre } = data;
        const sql = `INSERT INTO visual_arts (author_id, title, description, cover_image_url, status, price_monthly, genre, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [author_id, title, description, cover_image_url || null, status || 'draft', price_monthly || 0, genre || null]);
        return result;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            if (['title', 'description', 'cover_image_url', 'status', 'price_monthly', 'genre', 'display_order'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) return this.findById(id);

        const sql = `UPDATE visual_arts SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await db.query(sql, values);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM visual_arts WHERE id = ?', [id]);
        return true;
    }
}
