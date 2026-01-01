
import db from './src/server/db.js';
import 'dotenv/config';

async function checkBooks() {
    console.log('--- Checking for Works ---');
    const titles = ['Water Washes Earth', 'Island of The Thieves', 'Season of Lght', 'Tyger'];

    // Check Novels
    const { rows: novels } = await db.query('SELECT id, title, author_id FROM novels WHERE title IN (?, ?, ?, ?)', titles);
    console.log('--- Novels Found ---');
    console.table(novels);

    // Check Short Stories
    const { rows: stories } = await db.query('SELECT id, title, author_id FROM short_stories WHERE title IN (?, ?, ?, ?)', titles);
    console.log('--- Short Stories Found ---');
    console.table(stories);

    // Check Poems
    const { rows: poems } = await db.query('SELECT id, title, author_id FROM poems WHERE title IN (?, ?, ?, ?)', titles);
    console.log('--- Poems Found ---');
    console.table(poems);

    // Get Author ID for Michael James
    const { rows: authors } = await db.query('SELECT id, name FROM authors WHERE name LIKE ?', ['%Michael James%']);
    console.log('--- Author ID ---');
    console.table(authors);

    process.exit(0);
}

checkBooks();
