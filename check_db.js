
import db from './src/server/db.js';
import 'dotenv/config';

async function check() {
    console.log('--- Checking Users ---');
    const users = await db.query('SELECT id, email, role FROM users');
    console.table(users.rows);

    console.log('\n--- Checking Authors ---');
    const authors = await db.query('SELECT id, user_id, name, handle FROM authors');
    console.table(authors.rows);

    process.exit();
}

check();
