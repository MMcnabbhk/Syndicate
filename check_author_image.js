
import db from './src/server/db.js';

async function checkAuthorImage() {
    try {
        const { rows } = await db.query('SELECT id, name, profile_image_url FROM Authors WHERE id = ?', [1]);
        console.log('--- Author Profile Image ---');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAuthorImage();
