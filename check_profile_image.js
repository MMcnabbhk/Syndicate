
import db from './src/server/db.js';
import 'dotenv/config';

async function checkProfileImage() {
    console.log('--- Checking Profile Image ---');
    const { rows } = await db.query('SELECT id, name, profile_image_url FROM authors WHERE id = 1');
    console.table(rows);
    process.exit(0);
}

checkProfileImage();
