// src/server/models/PoetryCollection.js
import db from '../db.js';

export default class PoetryCollection {
    constructor({ id, author_id, title, description, cover_image_url, status, published_at, price_monthly }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.description = description;
        this.cover_image_url = cover_image_url;
        this.status = status;
        this.published_at = published_at;
        this.price_monthly = price_monthly || 0;
    }

    static async findAll() {
        try {
            const { rows } = await db.query('SELECT * FROM poetry_collections ORDER BY published_at DESC');
            return rows.map(row => new PoetryCollection(row));
        } catch (err) {
            console.warn("Database error in PoetryCollection.findAll, returning empty:", err.message);
            return [];
        }
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM poetry_collections WHERE id = ?', [id]);
        return rows.length ? new PoetryCollection(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, description, cover_image_url, status, price_monthly } = data;
        const sql = `INSERT INTO poetry_collections (author_id, title, description, cover_image_url, status, price_monthly, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [author_id, title, description, cover_image_url || null, status || 'draft', price_monthly || 0]);
        return result;
    }

    static async update(id, data) {
        const { title, description, cover_image_url, status, price_monthly } = data;
        const sql = `UPDATE poetry_collections SET title = ?, description = ?, cover_image_url = ?, status = ?, price_monthly = ? WHERE id = ?`;
        await db.query(sql, [title, description, cover_image_url, status, price_monthly, id]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM poetry_collections WHERE id = ?', [id]);
        return true;
    }
}
