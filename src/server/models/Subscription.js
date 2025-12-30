// src/server/models/Subscription.js
import db from '../db.js';

export default class Subscription {
    constructor({ id, user_id, work_id, status, current_period_end, created_at }) {
        this.id = id;
        this.user_id = user_id;
        this.work_id = work_id;
        this.status = status;
        this.current_period_end = current_period_end;
        this.created_at = created_at;
    }

    static async findByUserAndWork(userId, workId) {
        const { rows } = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = ? AND work_id = ? AND status = "active" AND current_period_end > NOW()',
            [userId, workId]
        );
        return rows.length ? new Subscription(rows[0]) : null;
    }

    static async create(data) {
        const { user_id, work_id, status, current_period_end } = data;
        const sql = `INSERT INTO subscriptions (user_id, work_id, status, current_period_end, created_at) 
                     VALUES (?, ?, ?, ?, NOW())`;
        const result = await db.query(sql, [
            user_id,
            work_id,
            status || 'active',
            current_period_end // Expecting ISO date string or Date object
        ]);
        return result;
    }

    static async cancel(id) {
        await db.query('UPDATE subscriptions SET status = "cancelled" WHERE id = ?', [id]);
        return true;
    }
}
