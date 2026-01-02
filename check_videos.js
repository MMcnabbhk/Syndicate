
import db from './src/server/db.js';

async function checkVideos() {
    try {
        const { rows } = await db.query(`SELECT video_introductions FROM authors WHERE name = 'Michael James' AND LENGTH(id) > 10`);
        if (rows.length > 0) {
            console.log('Video Data:', JSON.stringify(rows[0].video_introductions, null, 2));
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

checkVideos();
