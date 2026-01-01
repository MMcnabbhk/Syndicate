
import db from './src/server/db.js';
import 'dotenv/config';

async function debugLogin() {
    console.log('--- Debugging Dev Login Flow ---');
    const email = 'sample@example.com';

    // 1. Find User
    console.log(`1. Looking up user by email: ${email}`);
    const { rows: users } = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
        console.error('❌ User not found!');
        process.exit(1);
    }

    const user = users[0];
    console.log(`✅ User found: ID=${user.id}, Role=${user.role}`);

    // 2. Find Author
    console.log(`2. Looking up author by user_id: ${user.id}`);
    const { rows: authors } = await db.query('SELECT * FROM authors WHERE user_id = ?', [user.id]);

    if (authors.length === 0) {
        console.error('❌ Author not found for this user!');

        // List all authors to see what's there
        const { rows: allAuthors } = await db.query('SELECT id, user_id, name FROM authors');
        console.log('--- All Authors in DB ---');
        console.table(allAuthors);
    } else {
        const author = authors[0];
        console.log(`✅ Author found: ID=${author.id}, Name=${author.name}`);
        console.log(`🎉 SUCCESS: Login returns authorId=${author.id}`);
    }

    process.exit(0);
}

debugLogin();
