
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

router.get('/stats', async (req, res) => {
    try {
        let authorId = null;

        // 1. Try to get Author from logged-in user
        if (req.user) {
            const potentialIds = [req.user.google_id, req.user.microsoft_id, req.user.apple_id, req.user.id].filter(Boolean);
            for (const pid of potentialIds) {
                const author = await Author.findByUserId(pid);
                if (author) {
                    authorId = author.id;
                    break;
                }
            }
        }

        // 2. Fallback: If no author found (or not logged in), default to Michael James (UUID)
        // This failsafe ensures the demo page always works for the owner
        if (!authorId) {
            console.log('Community Stats: using fallback author Michael James');
            // Check for UUID Michael James first
            const { rows } = await db.query("SELECT id FROM authors WHERE name = 'Michael James' AND LENGTH(id) > 10");
            if (rows.length > 0) {
                authorId = rows[0].id;
            } else {
                // Try legacy
                const { rows: legacy } = await db.query("SELECT id FROM authors WHERE name = 'Michael James'");
                if (legacy.length > 0) authorId = legacy[0].id;
            }
        }

        if (!authorId) {
            return res.status(404).json({ error: 'Author profile not found' });
        }

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
                u.handle as user_name,
                u.name as full_name,
                MIN(s.created_at) as joined_at,
                COUNT(DISTINCT s.work_id) as total_works,
                n.title as recent_work_title
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
        let authorId = null;
        if (req.user) {
            const profileIds = [req.user.google_id, req.user.microsoft_id, req.user.apple_id, req.user.id].filter(Boolean);
            for (const pid of profileIds) {
                const author = await Author.findByUserId(pid);
                if (author) {
                    authorId = author.id;
                    break;
                }
            }
        }

        if (!authorId) return res.status(403).json({ error: 'Author profile required' });

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

export default router;
