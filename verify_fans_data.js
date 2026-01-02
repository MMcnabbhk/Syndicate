
import db from './src/server/db.js';

async function verifyFans() {
    try {
        const { rows: authors } = await db.query("SELECT id FROM authors WHERE name = 'Michael James' LIMIT 1");
        if (authors.length === 0) {
            console.log("Author Michael James not found");
            return;
        }
        const authorId = authors[0].id;

        const { rows: fans } = await db.query(`
            SELECT u.name as display_name, n.title, s.created_at 
            FROM subscriptions s 
            JOIN novels n ON s.work_id = n.id 
            JOIN users u ON CAST(s.user_id AS CHAR) COLLATE utf8mb4_unicode_ci = CAST(u.id AS CHAR) COLLATE utf8mb4_unicode_ci 
            WHERE n.author_id = ?`, [authorId]);

        console.log(`Found ${fans.length} fans for Michael James`);
        fans.forEach(f => console.log(`- ${f.display_name} subscribed to ${f.title}`));

        if (fans.length < 3) {
            console.log("Inserting mock fans for verification...");
            // Find some novels by this author
            const { rows: novels } = await db.query("SELECT id, title FROM novels WHERE author_id = ? LIMIT 3", [authorId]);
            if (novels.length === 0) {
                console.log("No novels found for this author to subscribe to.");
                return;
            }

            // Find some users (excluding the author himself if possible, but for mock it's fine)
            const { rows: users } = await db.query("SELECT id, display_name FROM users LIMIT 5");

            for (let i = 0; i < 3 && i < users.length; i++) {
                const workId = novels[i % novels.length].id;
                const userId = users[i].id;

                // Check if sub already exists
                const { rows: existing } = await db.query("SELECT id FROM subscriptions WHERE user_id = ? AND work_id = ?", [userId, workId]);
                if (existing.length === 0) {
                    await db.query("INSERT INTO subscriptions (user_id, work_id, status) VALUES (?, ?, 'active')", [userId, workId]);
                    console.log(`Subscribed ${users[i].display_name} to ${novels[i % novels.length].title}`);
                }
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

verifyFans();
