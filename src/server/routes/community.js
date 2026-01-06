
import express from 'express';
import db from '../db.js';
import Author from '../models/Author.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    // Fallback for dev/mock (if req.user injected)
    if (req.user) return next();

    res.status(401).json({ error: 'Unauthorized' });
};

router.get('/stats', isAuthenticated, async (req, res) => {
    try {
        const author = await Author.findByUserId(req.user.id);
        if (!author) {
            return res.status(404).json({ error: 'Author profile not found' });
        }
        const authorId = author.id;

        // 1. Fetch Fans (Subscriptions)
        // Grouped by Work
        // We join on novels for now (expand to other types later)
        const fansSql = `
            SELECT s.user_id, s.work_id, n.title as work_title, u.name as user_name, s.created_at as joined_at
            FROM subscriptions s
            JOIN novels n ON s.work_id = n.id
            LEFT JOIN users u ON CAST(s.user_id AS CHAR) COLLATE utf8mb4_unicode_ci = CAST(u.id AS CHAR) COLLATE utf8mb4_unicode_ci
            WHERE n.author_id = ? AND s.status = 'active'
        `;
        const { rows: fansRows } = await db.query(fansSql, [authorId]);

        // 1. Fetch Unique Fans (Total list for management)
        const uniqueFansSql = `
            SELECT 
                u.id as user_id,
                ANY_VALUE(u.handle) as user_name,
                ANY_VALUE(u.name) as full_name,
                ANY_VALUE(u.signup_source) as signup_source,
                ANY_VALUE(u.signup_creator_id) as signup_creator_id,
                MIN(s.created_at) as joined_at,
                COUNT(DISTINCT s.work_id) as total_works,
                ANY_VALUE(n.title) as recent_work_title
            FROM subscriptions s
            JOIN novels n ON s.work_id = n.id
            LEFT JOIN users u ON CAST(s.user_id AS CHAR) COLLATE utf8mb4_unicode_ci = CAST(u.id AS CHAR) COLLATE utf8mb4_unicode_ci
            WHERE n.author_id = ? AND s.status = 'active'
            GROUP BY u.id
            ORDER BY joined_at DESC
        `;
        const { rows: uniqueFansRows } = await db.query(uniqueFansSql, [authorId]);

        // 2. Fetch Fans grouped by Work (for existing overview if needed)
        // ... We'll keep the existing worksMap logic but populate it from uniqueFansRows if needed, 
        // or just return uniqueFans separately.
        const fansByWork = [];
        fansRows.forEach(row => {
            let work = fansByWork.find(w => w.workId === row.work_id);
            if (!work) {
                work = { workId: row.work_id, workTitle: row.work_title || 'Unknown Work', fans: [] };
                fansByWork.push(work);
            }
            work.fans.push({ userId: row.user_id, name: row.user_name || 'Anonymous', joinedAt: row.joined_at });
        });

        // 2. Fetch Contributions
        const contribSql = `
            SELECT c.amount, c.currency, c.type, c.created_at, n.title as work_title, u.name as user_name, u.handle as user_handle, c.work_id
            FROM contributions c
            LEFT JOIN novels n ON c.work_id = n.id
            LEFT JOIN users u ON CAST(c.user_id AS CHAR) COLLATE utf8mb4_unicode_ci = CAST(u.id AS CHAR) COLLATE utf8mb4_unicode_ci
            WHERE n.author_id = ? OR c.work_id = ?
            ORDER BY c.created_at DESC
        `;
        const { rows: contribRows } = await db.query(contribSql, [authorId, authorId]);

        // Map titles for display
        const mappedContributions = contribRows.map(c => ({
            ...c,
            work_title: c.work_title || (c.work_id === authorId ? 'Creator Profile' : 'Unknown Work')
        }));

        res.json({
            fansByWork: fansByWork,
            uniqueFans: uniqueFansRows,
            contributions: mappedContributions
        });

    } catch (err) {
        console.error('Error in community stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /fan/:userId
 * Deletes all active subscriptions for a fan to this creator's works.
 */
router.delete('/fan/:userId', isAuthenticated, async (req, res) => {
    try {
        const author = await Author.findByUserId(req.user.id);
        if (!author) return res.status(404).json({ error: 'Author profile not found' });
        const authorId = author.id;

        const { userId } = req.params;

        // Delete from follower base (subscriptions)
        const deleteSql = `
            DELETE FROM subscriptions 
            WHERE user_id = ? 
            AND work_id IN (
                SELECT id FROM novels WHERE author_id = ?
            )
        `;
        await db.query(deleteSql, [userId, authorId]);

        res.json({ success: true, message: 'Fan relationship removed' });

    } catch (err) {
        console.error('Error deleting fan:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/following/:authorId', async (req, res) => {
    try {
        // If not logged in, they can't be following
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.json({ isFollowing: false });
        }

        const { authorId } = req.params;
        const userId = req.user.id;
        const { rows } = await db.query(
            'SELECT 1 FROM author_followers WHERE user_id = ? AND author_id = ?',
            [userId, authorId]
        );
        res.json({ isFollowing: rows.length > 0 });
    } catch (err) {
        console.error('Error checking follow status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/follow/:authorId', isAuthenticated, async (req, res) => {
    try {
        const { authorId } = req.params;
        const userId = req.user.id;

        // Check if already following
        const { rows } = await db.query(
            'SELECT 1 FROM author_followers WHERE user_id = ? AND author_id = ?',
            [userId, authorId]
        );

        if (rows.length === 0) {
            await db.query(
                'INSERT INTO author_followers (user_id, author_id) VALUES (?, ?)',
                [userId, authorId]
            );
        }

        res.json({ success: true, isFollowing: true });
    } catch (err) {
        console.error('Error following author:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/unfollow/:authorId', isAuthenticated, async (req, res) => {
    try {
        const { authorId } = req.params;
        const userId = req.user.id;

        await db.query(
            'DELETE FROM author_followers WHERE user_id = ? AND author_id = ?',
            [userId, authorId]
        );

        res.json({ success: true, isFollowing: false });
    } catch (err) {
        console.error('Error unfollowing author:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
