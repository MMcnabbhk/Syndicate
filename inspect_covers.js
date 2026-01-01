
import db from './src/server/db.js';

async function inspectCovers() {
    try {
        const { rows } = await db.query('SELECT id, title, cover_image_url FROM Novels');
        console.log('--- Novels Covers ---');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectCovers();
