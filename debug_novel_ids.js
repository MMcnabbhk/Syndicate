
import db from './src/server/db.js';

async function checkIds() {
    console.log('Checking Novel Author IDs...');
    const { rows: novels } = await db.query('SELECT id, title, author_id FROM novels');
    console.table(novels);
    process.exit(0);
}

checkIds();
