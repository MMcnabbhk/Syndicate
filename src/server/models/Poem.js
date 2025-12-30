// src/server/models/Poem.js
import db from '../db.js';

export default class Poem {
    constructor({ id, author_id, title, content_html, form, tags, status, published_at, cover_image_url }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.content_html = content_html;
        this.form = form;
        this.tags = tags;
        this.status = status;
        this.published_at = published_at;
        this.cover_image_url = cover_image_url || null;
        this.price_monthly = price_monthly || 0;
    }

    static async findAll() {
        const { rows } = await db.query('SELECT * FROM poems ORDER BY published_at DESC');
        return rows.map(row => new Poem(row));
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM poems WHERE id = ?', [id]);
        return rows.length ? new Poem(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, content_html, form, tags, status, cover_image_url, price_monthly } = data;
        const sql = `INSERT INTO poems (author_id, title, content_html, form, tags, status, cover_image_url, price_monthly, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [author_id, title, content_html, form, tags, status || 'draft', cover_image_url || null, price_monthly || 0]);
        return result;
    }

    static async update(id, data) {
        const { title, content_html, form, tags, status, cover_image_url, price_monthly } = data;
        const sql = `UPDATE poems SET title = ?, content_html = ?, form = ?, tags = ?, status = ?, cover_image_url = ?, price_monthly = ? WHERE id = ?`;
        await db.query(sql, [title, content_html, form, tags, status, cover_image_url, price_monthly, id]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM poems WHERE id = ?', [id]);
        return true;
    }
}
