
import db from './src/server/db.js';

async function checkAuthors() {
    try {
        const { rows } = await db.query('SELECT id, name FROM authors');
        console.log(`Found ${rows.length} authors:`);
        rows.forEach(a => console.log(`- ID: ${a.id}, Name: ${a.name}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

checkAuthors();
