
import db from './src/server/db.js';

async function seed() {
    try {
        console.log('Fetching Michael James Works...');
        const { rows: works } = await db.query(
            "SELECT id, title FROM novels WHERE title IN ('Island Of The Thieves', 'Water Washes Earth') LIMIT 2"
        );
        if (works.length < 2) {
            console.log('Not enough works found. Skipping.');
            return;
        }
        const b1 = works[0].id; // Island
        const b2 = works[1].id; // Water

        console.log(`Works found: ${b1}, ${b2}`);

        // 1. Create/Get Users
        const usersToCreate = [
            { name: 'Alice Walker', email: 'alice@example.com', role: 'reader' },
            { name: 'Bob Smith', email: 'bob@example.com', role: 'reader' },
            { name: 'Charlie Day', email: 'charlie@example.com', role: 'reader' }
        ];

        const userIds = {};

        for (const u of usersToCreate) {
            // Check if exists by email
            const { rows: existing } = await db.query("SELECT id FROM users WHERE email = ?", [u.email]);
            let uid;
            if (existing.length > 0) {
                uid = existing[0].id;
                console.log(`User ${u.name} exists (ID: ${uid})`);
            } else {
                uid = Math.floor(Math.random() * 1000000) + 1000;
                await db.query(
                    "INSERT INTO users (id, oauth_provider, oauth_id, email, name, role) VALUES (?, ?, ?, ?, ?, ?)",
                    [uid, 'google', `mock_google_${Date.now()}_${Math.random()}`, u.email, u.name, u.role]
                );
                console.log(`Created user ${u.name} (ID: ${uid})`);
            }
            userIds[u.email] = uid;
        }

        const aliceId = userIds['alice@example.com'];
        const bobId = userIds['bob@example.com'];
        const charlieId = userIds['charlie@example.com'];

        // 2. Create Subscriptions
        const subs = [
            { user_id: aliceId, work_id: b1 },
            { user_id: bobId, work_id: b1 },
            { user_id: charlieId, work_id: b2 }
        ];

        for (const s of subs) {
            const { rows: existing } = await db.query("SELECT id FROM subscriptions WHERE user_id = ? AND work_id = ?", [s.user_id, s.work_id]);
            if (existing.length === 0) {
                await db.query(`
                    INSERT INTO subscriptions (user_id, work_id, status, current_period_end) 
                    VALUES (?, ?, 'active', DATE_ADD(NOW(), INTERVAL 1 MONTH))
                `, [s.user_id, s.work_id]);
                console.log(`Subscribed ${s.user_id} to ${s.work_id}`);
            }
        }

        // 3. Create Contributions
        // Clear old mock contributions for these users
        await db.query(`DELETE FROM contributions WHERE user_id IN (?, ?, ?)`, [aliceId, bobId, charlieId]);

        const contributions = [
            { user_id: aliceId, work_id: b1, amount: 5.00, type: 'subscription', date: '2025-12-01 10:00:00' },
            { user_id: aliceId, work_id: b1, amount: 5.00, type: 'subscription', date: '2026-01-01 10:00:00' },
            { user_id: aliceId, work_id: b1, amount: 10.00, type: 'tip', date: '2026-01-02 12:00:00' },
            { user_id: bobId, work_id: b1, amount: 5.00, type: 'subscription', date: '2025-12-20 14:00:00' },
            { user_id: charlieId, work_id: b2, amount: 3.00, type: 'subscription', date: '2025-12-30 09:00:00' }
        ];

        for (const c of contributions) {
            await db.query(`
                INSERT INTO contributions (user_id, work_id, amount, type, created_at)
                VALUES (?, ?, ?, ?, ?)
            `, [c.user_id, c.work_id, c.amount, c.type, c.date]);
        }
        console.log('Contributions seeded.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

seed();
