
import db from './src/server/db.js';

async function listTables() {
    console.log('--- Listing All Tables ---');
    try {
        // Correct query for MySQL
        const { rows } = await db.query('SHOW TABLES');
        // rows will be an array of objects like { 'Tables_in_serialized_novels': 'authors' }
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listTables();
