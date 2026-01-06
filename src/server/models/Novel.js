// src/server/models/Novel.js
import db from '../db.js';

export default class Novel {
    constructor({ id, author_id, title, description, cover_image_url, status, price_monthly, published_at, subscribers_count, lifetime_earnings, genre, author_name, frequency, full_download, goodreads_url, amazon_url, spotify_url, rating, length, short_description }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.description = description;
        this.cover_image_url = cover_image_url || null;
        this.status = status;
        this.price_monthly = price_monthly || 0;
        this.published_at = published_at;
        this.subscribers_count = subscribers_count || 0;
        this.lifetime_earnings = lifetime_earnings || 0;
        this.genre = genre || null;
        this.author = author_name || null;
        this.frequency = frequency || 'Daily';
        this.full_download = full_download || false;
        this.goodreads_url = goodreads_url || null;
        this.amazon_url = amazon_url || null;
        this.spotify_url = spotify_url || null;
        this.rating = rating || 0;
        this.length = length || null;
        this.short_description = short_description || null;
    }

    static async findAll() {
        try {
            const sql = `
                SELECT n.*, a.name as author_name 
                FROM novels n 
                LEFT JOIN authors a ON n.author_id = a.id
            `;
            const { rows } = await db.query(sql);
            return rows.map(row => new Novel(row));
        } catch (err) {
            console.error("Database error in Novel.findAll:", err.message);
            // Return empty array instead of mock data since we've synced to SQL
            return [];
        }
    }

    static async findById(id) {
        const sql = `
            SELECT n.*, a.name as author_name 
            FROM novels n 
            LEFT JOIN authors a ON n.author_id = a.id
            WHERE n.id = ?
        `;
        const { rows } = await db.query(sql, [id]);
        return rows.length ? new Novel(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, description, cover_image_url, status, price_monthly, frequency, full_download, goodreads_url, amazon_url, spotify_url, rating, length, short_description, genre } = data;
        const id = crypto.randomUUID();
        const sql = `INSERT INTO novels (id, author_id, title, description, cover_image_url, status, price_monthly, frequency, full_download, goodreads_url, amazon_url, spotify_url, rating, length, short_description, genre, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [id, author_id, title, description, cover_image_url || null, status || 'draft', price_monthly || 0, frequency || 'Daily', full_download || false, goodreads_url || null, amazon_url || null, spotify_url || null, rating || 0, length || null, short_description || null, genre || null]);
        return { insertId: id, ...result };
    }

    static async update(id, data) {
        const { title, description, cover_image_url, status, price_monthly, genre, frequency, full_download, goodreads_url, amazon_url, spotify_url, rating, length, short_description } = data;
        const sql = `UPDATE novels SET title = ?, description = ?, cover_image_url = ?, status = ?, price_monthly = ?, genre = ?, frequency = ?, full_download = ?, goodreads_url = ?, amazon_url = ?, spotify_url = ?, rating = ?, length = ?, short_description = ? WHERE id = ?`;
        await db.query(sql, [title, description, cover_image_url, status, price_monthly, genre || null, frequency, full_download, goodreads_url, amazon_url, spotify_url, rating, length, short_description, id]);
        return this.findById(id);
    }

    static async delete(id) {
        return await db.query('DELETE FROM novels WHERE id = ?', [id]);
    }
}
