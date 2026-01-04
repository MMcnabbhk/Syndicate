// src/server/models/VisualArtFolio.js
import db from '../db.js';

export default class VisualArtFolio {
    constructor({ id, visual_art_id, chapter_number, title, image_url, description, published_at, display_order }) {
        this.id = id;
        this.visual_art_id = visual_art_id;
        this.chapter_number = chapter_number; // Internal consistency: using chapter_number for folio sequence
        this.title = title;
        this.image_url = image_url;
        this.description = description;
        this.published_at = published_at;
        this.display_order = display_order;
    }

    static async findAllByVisualArtId(visualArtId) {
        const { rows } = await db.query('SELECT * FROM visual_art_folios WHERE visual_art_id = ? ORDER BY chapter_number ASC', [visualArtId]);
        return rows.map(row => new VisualArtFolio(row));
    }

    static async create(data) {
        const { visual_art_id, chapter_number, title, image_url, description } = data;
        const sql = `INSERT INTO visual_art_folios (visual_art_id, chapter_number, title, image_url, description, published_at) 
                     VALUES (?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [visual_art_id, chapter_number, title, image_url, description]);
        return result;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            if (['chapter_number', 'title', 'image_url', 'description', 'display_order'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) return null;

        const sql = `UPDATE visual_art_folios SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await db.query(sql, values);
        const { rows } = await db.query('SELECT * FROM visual_art_folios WHERE id = ?', [id]);
        return rows.length ? new VisualArtFolio(rows[0]) : null;
    }
}
