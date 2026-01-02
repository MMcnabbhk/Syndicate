
import db from './src/server/db.js';

async function checkSchema() {
    try {
        const { rows } = await db.query('SHOW COLUMNS FROM authors');
        console.log('Authors Columns:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error querying schema:', err);
        process.exit(1);
    }
}

checkSchema();
