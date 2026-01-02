
import db from './src/server/db.js';

async function checkWorks() {
    console.log('--- Checking Works Ownership ---');

    try {
        // Get our current author ID (we know it from previous steps but let's be sure)
        // We authenticated as michael@creator.com which is linked to the new UUID author ID
        // Let's find that ID again
        const { rows: authors } = await db.query(`SELECT * FROM authors WHERE name LIKE '%Michael%'`);
        console.log('\n--- Authors ---');
        console.table(authors);

        // Check Novels
        const { rows: novels } = await db.query('SELECT id, title, author_id FROM novels');
        console.log('\n--- Novels ---');
        console.table(novels);

        // Check Poems
        const { rows: poems } = await db.query('SELECT id, title, author_id FROM poems');
        console.log('\n--- Poems ---');
        console.table(poems);

        // Check Short Stories
        const { rows: stories } = await db.query('SELECT id, title, author_id FROM short_stories');
        console.log('\n--- Short Stories ---');
        console.table(stories);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkWorks();
