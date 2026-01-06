// src/server/models/AudiobookChapter.js
import db from '../db.js';

export default class AudiobookChapter {
    constructor({ id, audiobook_id, chapter_number, title, audio_url, duration_seconds, spotify_url }) {
        this.id = id;
        this.audiobook_id = audiobook_id;
        this.chapter_number = chapter_number;
        this.title = title;
        this.audio_url = audio_url;
        this.duration_seconds = duration_seconds;
        this.spotify_url = spotify_url || null;
    }

    static async findAllByAudiobookId(audiobookId) {
        const { rows } = await db.query('SELECT * FROM audiobook_chapters WHERE audiobook_id = ? ORDER BY chapter_number ASC', [audiobookId]);
        return rows.map(row => new AudiobookChapter(row));
    }

    static async create(data) {
        const { audiobook_id, chapter_number, title, audio_url, duration_seconds, spotify_url } = data;
        const id = crypto.randomUUID();
        const sql = `INSERT INTO audiobook_chapters (id, audiobook_id, chapter_number, title, audio_url, duration_seconds, spotify_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const { rows } = await db.query(sql, [id, audiobook_id, chapter_number, title, audio_url, duration_seconds, spotify_url || null]);
        return rows;
    }
}
