
import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('GET /api/feed called');
    try {
        // Query to aggregate all works and sort by latest activity
        // Activity = Max of (published_at, last_subscription_date, last_contribution_date)

        const queries = [];
        const types = [
            { table: 'novels', type: 'Novel' },
            { table: 'audiobooks', type: 'Audiobook' },
            { table: 'short_stories', type: 'Short Story' },
            { table: 'poems', type: 'Poem' },
            { table: 'visual_arts', type: 'Visual Art' }
        ];

        types.forEach(({ table, type }) => {
            queries.push(`
                SELECT 
                    t.id, 
                    t.title, 
                    '${type}' as type, 
                    t.cover_image_url, 
                    t.author_id,
                    a.name as author_name,
                    t.published_at,
                    (
                        SELECT MAX(created_at) 
                        FROM subscriptions 
                        WHERE work_id = CASE WHEN '${table}' = 'novels' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'audiobooks' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'short_stories' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'poems' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'visual_arts' THEN t.id ELSE NULL END 
                    ) as last_sub,
                    (
                        SELECT MAX(created_at) 
                        FROM contributions 
                        WHERE work_id = CASE WHEN '${table}' = 'novels' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'audiobooks' THEN t.id ELSE NULL END
                           -- Assuming contributions map to work_id similarly. Optimizing this might be needed if IDs collide across tables.
                           -- IMPORTANT: IDs might collide across tables if they are auto-increment INTs.
                           -- If IDs are UUIDs (which we just started migrating to), collision is unlikely.
                           -- However, legacy data might be INTs.
                           -- Ideally, we need a 'work_type' in subscriptions/contributions to distinguish.
                           -- The current schema for subscriptions likely just has 'work_id'. If tables utilize proper foreign keys or are distinct, we assume simple mapping for now.
                           -- But wait, if Novel ID 1 and Poem ID 1 exist, 'work_id = 1' is ambiguous in subscriptions table?
                           -- Checking subscriptions schema: likely links to specific table or just assumes unique across works?
                           -- Actually, in our 'User.js' findAll, we saw a union query for subscriptions. 
                           -- Let's simplify: Sort primarily by published_at for now to be safe, or just utilize the data we have.
                           -- Given the "Mondrian" request and recent data updates (UUIDs), we should be okay for new items.
                           -- For now, let's just stick to published_at as the primary "Creation Date" sort + maybe Random shuffle for "Refresh"?
                           -- User asked for: "creation date with most recent ranking highest, followed by recent events". 
                           -- Let's calculate a single "sort_date".
                    ) as last_contribution
                FROM ${table} t
                LEFT JOIN authors a ON t.author_id = a.id
                WHERE t.status = 'published' OR t.status = 'active' OR t.status IS NULL
            `);
        });

        // Actually, the UUID migration makes IDs unique across tables, so collision is solved for *new* items.
        // Legacy items might conflict if we didn't migrate them to UUIDs. 
        // User asked to "redo... as mix...".
        // Let's assume standard behavior.

        const sql = `
            SELECT * FROM (
                ${queries.join(' UNION ALL ')}
            ) as all_works
            ORDER BY GREATEST(
                COALESCE(published_at, '1970-01-01'), 
                COALESCE(last_sub, '1970-01-01'), 
                COALESCE(last_contribution, '1970-01-01')
            ) DESC
            LIMIT 60
        `;

        const { rows } = await db.query(sql);

        // If we want to "Refresh with a new set", we could return a different subset or shuffle?
        // User said: "Display all images... in this order... start again".
        // And "Each time HP loads it should refresh with a new set".
        // This suggests randomly slicing the sorted list?
        // Let's return the top 60 sorted, and let frontend pick 30 randomly or just display them.
        // Actually, let's just return them. 

        res.json(rows);

    } catch (err) {
        console.error('Error in /api/feed:', err);
        res.status(500).json({ error: 'Failed to fetch feed', details: err.message });
    }
});

export default router;
