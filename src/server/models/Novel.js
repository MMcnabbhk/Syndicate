// src/server/models/Novel.js
import db from '../db.js';

export default class Novel {
    constructor({ id, author_id, title, description, cover_image_url, status, price_monthly, published_at }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.description = description;
        this.cover_image_url = cover_image_url || null;
        this.status = status;
        this.price_monthly = price_monthly || 0;
        this.published_at = published_at;
    }

    static async findAll() {
        try {
            const { rows } = await db.query('SELECT * FROM novels');
            return rows.map(row => new Novel(row));
        } catch (err) {
            console.error("Database error in Novel.findAll:", err.message);
            // Return empty array instead of mock data since we've synced to SQL
            return [];
        }
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM novels WHERE id = ?', [id]);
        return rows.length ? new Novel(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, description, cover_image_url, status, price_monthly } = data;
        const sql = `INSERT INTO novels (author_id, title, description, cover_image_url, status, price_monthly, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [author_id, title, description, cover_image_url || null, status || 'draft', price_monthly || 0]);
        return result;
    }

    static async update(id, data) {
        const { title, description, cover_image_url, status, price_monthly } = data;
        const sql = `UPDATE novels SET title = ?, description = ?, cover_image_url = ?, status = ?, price_monthly = ? WHERE id = ?`;
        await db.query(sql, [title, description, cover_image_url, status, price_monthly, id]);
        return this.findById(id);
    }

    static async delete(id) {
        return await db.query('DELETE FROM novels WHERE id = ?', [id]);
    }
}
