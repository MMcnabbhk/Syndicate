
import db from '../db.js';

export const send = async (userId, type, title, message) => {
    try {
        if (!userId) {
            console.warn('[Notification] Skipped: No userId provided');
            return;
        }
        await db.query(
            'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
            [userId, type, title, message]
        );
        console.log(`[Notification] Sent to user ${userId}: ${title}`);
    } catch (error) {
        console.error('[Notification] Failed to send:', error);
    }
};

export default { send };
