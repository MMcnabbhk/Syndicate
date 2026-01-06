
import db from '../db.js';

export default class Chapter {
    constructor({ id, novel_id, title, chapter_number, content_html, status, created_at, external_url }) {
        this.id = id;
        this.novel_id = novel_id;
        this.title = title;
        this.chapter_number = chapter_number;
        this.content_html = content_html;
        this.status = status;
        this.created_at = created_at;
        this.external_url = external_url;
    }

    static async findAllByNovelId(novelId) {
        try {
            console.log(`Chapter.findAllByNovelId called for novelId: ${novelId}`);
            const sql = 'SELECT * FROM chapters WHERE novel_id = ? ORDER BY chapter_number ASC';
            const { rows } = await db.query(sql, [novelId]);
            console.log(`Chapter.findAllByNovelId result count: ${rows.length}`);
            return rows.map(row => new Chapter(row));
        } catch (err) {
            console.error("Database error in Chapter.findAllByNovelId:", err.message);
            return [];
        }
    }

    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM chapters WHERE id = ?', [id]);
        return rows.length ? new Chapter(rows[0]) : null;
    }

    static async create(data) {
        const { novel_id, title, chapter_number, content_html, status, external_url } = data;
        // Default to release_day = 0 if not provided (available immediately to subscribers)
        const release_day = data.release_day || 0;

        const sql = `INSERT INTO chapters (novel_id, title, chapter_number, content_html, status, release_day, external_url, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [novel_id, title, chapter_number, content_html, status || 'draft', release_day, external_url || null]);

        // Return the new chapter object (re-fetching or constructing)
        // For simplicity in this stack, we'll return the ID and data.
        return {
            id: result.insertId,
            novel_id,
            title,
            chapter_number,
            status,
            release_day
        };
    }
}
