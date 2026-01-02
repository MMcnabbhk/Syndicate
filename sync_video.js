
import db from './src/server/db.js';

async function syncVideo() {
    try {
        // Get video data from UUID author
        const { rows } = await db.query(`SELECT video_introductions FROM authors WHERE LENGTH(id) > 10 AND name = 'Michael James'`);
        if (rows.length === 0) {
            console.log('Main author not found');
            return;
        }
        const videoJson = JSON.stringify(rows[0].video_introductions);

        // Update ID 1
        await db.query(`UPDATE authors SET video_introductions = ? WHERE id = '1'`, [videoJson]);
        console.log('Synced video data to Author ID 1');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

syncVideo();
