// src/server/models/ShortStory.js
import db from '../db.js';

import db from '../db.js';

export default class ShortStory {
    constructor({ id, author_id, title, content_html, genre, summary, status, published_at, cover_image_url, price_monthly }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.content_html = content_html;
        this.genre = genre;
        this.summary = summary;
        this.status = status;
        this.published_at = published_at;
        this.cover_image_url = cover_image_url || null;
        this.price_monthly = price_monthly || 0;
    }

    static async findAll() {
        let dbStories = [];
        try {
            const { rows } = await db.query('SELECT * FROM short_stories ORDER BY published_at DESC');
            dbStories = rows.map(row => new ShortStory(row));
        } catch (err) {
            console.warn("Database error in ShortStory.findAll, using mock data only:", err.message);
        }

        // Map mock data
        const mockStories = SHORT_STORIES.map(s => new ShortStory({
            id: s.id,
            author_id: 'a1', // Assumption
            title: s.title,
            content_html: '', // Not needed for list
            genre: s.genre,
            summary: s.blurb,
            status: 'published',
            published_at: s.releaseDate,
            cover_image_url: s.coverImage,
            price_monthly: s.priceFull
        }));

        return [...dbStories, ...mockStories];
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM short_stories WHERE id = ?', [id]);
        return rows.length ? new ShortStory(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, content_html, genre, summary, status, cover_image_url, price_monthly } = data;
        const sql = `INSERT INTO short_stories (author_id, title, content_html, genre, summary, status, cover_image_url, price_monthly, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [author_id, title, content_html, genre, summary, status || 'draft', cover_image_url || null, price_monthly || 0]);
        return result;
    }

    static async update(id, data) {
        const { title, content_html, genre, summary, status, cover_image_url, price_monthly } = data;
        const sql = `UPDATE short_stories SET title = ?, content_html = ?, genre = ?, summary = ?, status = ?, cover_image_url = ?, price_monthly = ? WHERE id = ?`;
        await db.query(sql, [title, content_html, genre, summary, status, cover_image_url, price_monthly, id]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM short_stories WHERE id = ?', [id]);
        return true;
    }
}
