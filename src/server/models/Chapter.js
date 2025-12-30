import db from '../db.js';

class Chapter {
    constructor(data) {
        this.id = data.id;
        this.work_id = data.work_id;
        this.content_type = data.content_type; // 'novel', 'audiobook', etc.
        this.chapter_number = data.chapter_number;
        this.title = data.title;
        this.content_html = data.content_html;
        this.release_day = data.release_day; // Relative day from start (0, 7, 14, etc.)
        this.created_at = data.created_at;
    }

    static async findAllByWorkId(workId) {
        const [rows] = await db.query('SELECT * FROM chapters WHERE work_id = ? ORDER BY chapter_number ASC', [workId]);
        return rows.map(row => new Chapter(row));
    }

    static async create(data) {
        const [result] = await db.query(
            'INSERT INTO chapters (work_id, content_type, chapter_number, title, content_html, release_day) VALUES (?, ?, ?, ?, ?, ?)',
            [data.work_id, data.content_type, data.chapter_number, data.title, data.content_html, data.release_day]
        );
        return new Chapter({ id: result.insertId, ...data });
    }
}

export default Chapter;
