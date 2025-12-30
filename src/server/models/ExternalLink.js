import db from '../db.js';

class ExternalLink {
    constructor(data) {
        this.id = data.id;
        this.work_id = data.work_id;
        this.platform_name = data.platform_name; // e.g., 'Amazon', 'Patreon'
        this.url = data.url;
        this.is_active = data.is_active || true;
    }

    static async findAllByWorkId(workId) {
        const [rows] = await db.query('SELECT * FROM external_links WHERE work_id = ? AND is_active = 1', [workId]);
        return rows.map(row => new ExternalLink(row));
    }

    static async create(data) {
        const [result] = await db.query(
            'INSERT INTO external_links (work_id, platform_name, url, is_active) VALUES (?, ?, ?, ?)',
            [data.work_id, data.platform_name, data.url, data.is_active ? 1 : 0]
        );
        return new ExternalLink({ id: result.insertId, ...data });
    }
}

export default ExternalLink;
