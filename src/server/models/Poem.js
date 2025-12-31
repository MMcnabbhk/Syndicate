// src/server/models/Poem.js
import db from '../db.js';

import db from '../db.js';

export default class Poem {
    constructor({ id, author_id, title, content_html, form, tags, status, published_at, cover_image_url, price_monthly }) {
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
        let dbPoems = [];
        try {
            const { rows } = await db.query('SELECT * FROM poems ORDER BY published_at DESC');
            dbPoems = rows.map(row => new Poem(row));
        } catch (err) {
            console.warn("Database error in Poem.findAll, using mock data only:", err.message);
        }

        const mockPoems = POEMS.map(p => new Poem({
            id: p.id,
            author_id: 'a1', // Assumption
            title: p.title,
            content_html: '',
            form: 'Free Verse',
            tags: [],
            status: 'published',
            published_at: p.releaseDate,
            cover_image_url: p.coverImage,
            price_monthly: p.priceFull
        }));

        return [...dbPoems, ...mockPoems];
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
