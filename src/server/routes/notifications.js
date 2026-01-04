
import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/notifications - Fetch notifications for the logged-in user
router.get('/', async (req, res) => {
    try {
        // Mock user ID for now if not authenticated, or use req.user.id
        // For development/demo, we might need a fallback or ensure auth
        const userId = req.user?.id || 'demo-user-id';

        const { rows } = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// POST /api/notifications/mark-read - Mark notifications as read
router.post('/mark-read', async (req, res) => {
    try {
        const userId = req.user?.id || 'demo-user-id';
        const { notificationIds } = req.body; // Array of IDs, or 'all'

        if (notificationIds === 'all') {
            await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
        } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
            await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND id IN (?)', [userId, notificationIds]);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notifications read:', error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
});

// POST /api/notifications/create - Internal/Mock use to create notifications
router.post('/create', async (req, res) => {
    try {
        const { userId, type, title, message } = req.body;
        // userId fallback
        const targetUserId = userId || req.user?.id || 'demo-user-id';

        await db.query(
            'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
            [targetUserId, type, title, message]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
});

export default router;
