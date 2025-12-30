// src/server/models/Audiobook.js
import db from '../db.js';

export default class Audiobook {
    constructor({ id, author_id, title, cover_image_url, narrator, duration_seconds, status, published_at }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.cover_image_url = cover_image_url;
        this.narrator = narrator;
        this.duration_seconds = duration_seconds;
        this.status = status;
        this.published_at = published_at;
        this.price_monthly = price_monthly || 0;
    }

    static async findAll() {
        const { rows } = await db.query('SELECT * FROM audiobooks ORDER BY published_at DESC');
        return rows.map(row => new Audiobook(row));
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM audiobooks WHERE id = ?', [id]);
        return rows.length ? new Audiobook(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, cover_image_url, narrator, duration_seconds, status, price_monthly } = data;
        const sql = `INSERT INTO audiobooks (author_id, title, cover_image_url, narrator, duration_seconds, status, price_monthly, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [author_id, title, cover_image_url || null, narrator, duration_seconds, status || 'draft', price_monthly || 0]);
        return result;
    }

    static async update(id, data) {
        const { title, cover_image_url, narrator, duration_seconds, status, price_monthly } = data;
        const sql = `UPDATE audiobooks SET title = ?, cover_image_url = ?, narrator = ?, duration_seconds = ?, status = ?, price_monthly = ? WHERE id = ?`;
        await db.query(sql, [title, cover_image_url, narrator, duration_seconds, status, price_monthly, id]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM audiobooks WHERE id = ?', [id]);
        return true;
    }
}
