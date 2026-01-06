import db from '../db.js';




export default class Audiobook {
    constructor({ id, author_id, title, cover_image_url, narrator, duration_seconds, status, published_at, price_monthly, subscribers_count, lifetime_earnings, genre, full_download, goodreads_url, amazon_url, spotify_url, rating, short_description }) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.cover_image_url = cover_image_url;
        this.narrator = narrator;
        this.duration_seconds = duration_seconds;
        this.status = status;
        this.published_at = published_at;
        this.price_monthly = price_monthly || 0;
        this.subscribers_count = subscribers_count || 0;
        this.lifetime_earnings = lifetime_earnings || 0;
        this.genre = genre || null;
        this.full_download = full_download || false;
        this.goodreads_url = goodreads_url || null;
        this.amazon_url = amazon_url || null;
        this.spotify_url = spotify_url || null;
        this.rating = rating || 0;
        this.short_description = short_description || null;
    }

    static async findAll() {
        try {
            const { rows } = await db.query('SELECT * FROM audiobooks');
            return rows.map(row => new Audiobook(row));
        } catch (err) {
            console.error("Database error in Audiobook.findAll:", err.message);
            return [];
        }
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM audiobooks WHERE id = ?', [id]);
        return rows.length ? new Audiobook(rows[0]) : null;
    }

    static async create(data) {
        const { author_id, title, cover_image_url, narrator, duration_seconds, status, price_monthly, full_download, goodreads_url, amazon_url, spotify_url, rating, short_description } = data;
        const id = crypto.randomUUID();
        const sql = `INSERT INTO audiobooks (id, author_id, title, cover_image_url, narrator, duration_seconds, status, price_monthly, full_download, goodreads_url, amazon_url, spotify_url, rating, short_description, published_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [id, author_id, title, cover_image_url || null, narrator, duration_seconds, status || 'draft', price_monthly || 0, full_download || false, goodreads_url || null, amazon_url || null, spotify_url || null, rating || 0, short_description || null]);
        return { insertId: id, ...result };
    }

    static async update(id, data) {
        const { title, cover_image_url, narrator, duration_seconds, status, price_monthly, full_download, goodreads_url, amazon_url, spotify_url, rating, short_description } = data;
        const sql = `UPDATE audiobooks SET title = ?, cover_image_url = ?, narrator = ?, duration_seconds = ?, status = ?, price_monthly = ?, full_download = ?, goodreads_url = ?, amazon_url = ?, spotify_url = ?, rating = ?, short_description = ? WHERE id = ?`;
        await db.query(sql, [title, cover_image_url, narrator, duration_seconds, status, price_monthly, full_download, goodreads_url, amazon_url, spotify_url, rating, short_description, id]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM audiobooks WHERE id = ?', [id]);
        return true;
    }
}
