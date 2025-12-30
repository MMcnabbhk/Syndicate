import express from 'express';
import Chapter from '../models/Chapter.js';
import ScheduleService from '../services/ScheduleService.js';
import BillingService from '../services/BillingService.js';

import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/syndication/chapters/:workId
 * Returns available chapters for a user based on relative schedule.
 */
router.get('/chapters/:workId', authMiddleware, async (req, res) => {
    try {
        const chapters = await Chapter.findAllByWorkId(req.params.workId);

        // Filter chapters based on schedule engine and billing
        const availableChapters = await Promise.all(chapters.map(async ch => {
            const isUnlocked = ScheduleService.isContentAvailable(req.user.joinDate, ch.release_day);

            // Check billing if unlocked by schedule
            let accessGranted = isUnlocked;
            if (isUnlocked) {
                accessGranted = await BillingService.verifyAccess(req.user.id, req.params.workId, ch.content_type, ch.chapter_number, ch.release_day);
            }

            return {
                ...ch,
                isUnlocked: accessGranted,
                isGated: isUnlocked && !accessGranted, // Schedule is OK, but needs subscription
                content_html: accessGranted ? ch.content_html : null,
                unlockDate: isUnlocked ? null : ScheduleService.getEstimatedUnlockDate(req.user.joinDate, ch.release_day)
            };
        }));

        res.json(availableChapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
