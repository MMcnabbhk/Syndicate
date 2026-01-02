
import db from './src/server/db.js';

async function checkLegacyWorks() {
    try {
        const { rows: novels } = await db.query("SELECT id, title FROM novels WHERE author_id = '1'");
        console.log(`Novels linked to ID 1: ${novels.length}`);
        novels.forEach(n => console.log(`- ${n.title}`));

        // Check if there are other Michael James accounts to keep
        const { rows: authors } = await db.query("SELECT id, name, user_id FROM authors WHERE name = 'Michael James'");
        console.log('Authors named Michael James:');
        authors.forEach(a => console.log(`- ID: ${a.id}, UserID: ${a.user_id}`));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

checkLegacyWorks();
