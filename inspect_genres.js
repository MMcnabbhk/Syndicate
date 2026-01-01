
import db from './src/server/db.js';

async function inspectGenres() {
    try {
        const { rows } = await db.query('SELECT id, title, genre FROM Novels');
        console.log('--- Novels Genres ---');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectGenres();
