
import db from './src/server/db.js';

async function checkData() {
    try {
        const { rows } = await db.query("SELECT * FROM contributions LIMIT 10");
        console.log("Contributions Sample:", JSON.stringify(rows, null, 2));

        const { rows: authors } = await db.query("SELECT id, name FROM authors WHERE name = 'Michael James'");
        console.log("Authors Sample:", JSON.stringify(authors, null, 2));

        const { rows: novels } = await db.query("SELECT id, title FROM novels WHERE author_id IN (SELECT id FROM authors WHERE name = 'Michael James')");
        console.log("Novels Sample:", JSON.stringify(novels, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkData();
