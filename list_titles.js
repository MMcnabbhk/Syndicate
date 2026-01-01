
import db from './src/server/db.js';
import 'dotenv/config';

async function listTitles() {
    console.log('--- Listing Novels ---');
    const { rows: novels } = await db.query('SELECT id, title, author_id FROM novels');
    console.table(novels);
    process.exit(0);
}

listTitles();
