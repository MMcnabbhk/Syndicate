
import db from './src/server/db.js';

async function countAuthors() {
    const { rows } = await db.query('SELECT count(*) as count FROM authors');
    console.log(`Total Authors: ${rows[0].count}`);

    const { rows: all } = await db.query('SELECT id, name FROM authors');
    console.table(all);
    process.exit(0);
}

countAuthors();
