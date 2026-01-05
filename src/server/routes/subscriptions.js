import express from 'express';
import db from '../db.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    // Fallback for dev/mock (if req.user injected)
    if (req.user) return next();

    res.status(401).json({ error: 'Unauthorized' });
};

// GET /api/subscriptions
// Get all active subscribed works for the current user
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;

        // Join subscriptions with novels and authors to get work details
        const sql = `
            SELECT 
                n.id as id,
                n.title,
                n.description,
                n.cover_image_url,
                n.genre,
                n.frequency as syndicationCadence,
                a.name as author,
                n.author_id as authorId,
                s.created_at as subscribedDate
            FROM subscriptions s
            JOIN novels n ON s.work_id = n.id
            JOIN authors a ON n.author_id = a.id
            WHERE s.user_id = ? AND s.status = 'active'
            ORDER BY s.created_at DESC
        `;

        const { rows } = await db.query(sql, [userId]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching subscribed works:', err);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

// DELETE /api/subscriptions/:workId
// Unsubscribe from a work
router.delete('/:workId', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const workId = req.params.workId;

        // Verify if subscription exists
        const checkSql = 'SELECT * FROM subscriptions WHERE user_id = ? AND work_id = ? AND status = "active"';
        const { rows } = await db.query(checkSql, [userId, workId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        // Update status to cancelled (soft delete)
        const updateSql = 'UPDATE subscriptions SET status = "cancelled" WHERE user_id = ? AND work_id = ?';
        await db.query(updateSql, [userId, workId]);

        res.json({ success: true, message: 'Unsubscribed successfully' });
    } catch (err) {
        console.error('Error unsubscribing:', err);
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
});

export default router;
