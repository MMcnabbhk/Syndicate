// src/server/models/AudiobookChapter.js
import db from '../db.js';

export default class AudiobookChapter {
    constructor({ id, audiobook_id, chapter_number, title, audio_url, duration_seconds }) {
        this.id = id;
        this.audiobook_id = audiobook_id;
        this.chapter_number = chapter_number;
        this.title = title;
        this.audio_url = audio_url;
        this.duration_seconds = duration_seconds;
    }

    static async findAllByAudiobookId(audiobookId) {
        const { rows } = await db.query('SELECT * FROM audiobook_chapters WHERE audiobook_id = ? ORDER BY chapter_number ASC', [audiobookId]);
        return rows.map(row => new AudiobookChapter(row));
    }

    static async create(data) {
        const { audiobook_id, chapter_number, title, audio_url, duration_seconds } = data;
        const sql = `INSERT INTO audiobook_chapters (audiobook_id, chapter_number, title, audio_url, duration_seconds) 
                     VALUES (?, ?, ?, ?, ?)`;
        const { rows } = await db.query(sql, [audiobook_id, chapter_number, title, audio_url, duration_seconds]);
        return rows;
    }
}
