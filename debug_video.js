
import db from './src/server/db.js';

async function checkVideo() {
    console.log('--- Checking Video Data ---');
    try {
        const { rows } = await db.query(`SELECT id, name, video_introductions FROM authors WHERE id = 'd3993ab0-2a72-4f1d-b676-cd15051fae50'`);

        if (rows.length > 0) {
            const author = rows[0];
            console.log('Author:', author.name);
            console.log('Video Data:', author.video_introductions);

            if (typeof author.video_introductions === 'string') {
                try {
                    const parsed = JSON.parse(author.video_introductions);
                    console.log('Parsed:', parsed);
                } catch (e) {
                    console.log('Parse Error:', e.message);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkVideo();
