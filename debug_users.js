
import db from './src/server/db.js';

async function debugUsers() {
    try {
        console.log('--- USERS ---');
        const users = await db.query('SELECT id, email, role FROM users');
        console.table(users.rows);

        console.log('\n--- AUTHORS ---');
        const authors = await db.query('SELECT id, user_id, name FROM authors');
        console.table(authors.rows);

        console.log('\n--- DIAGNOSIS ---');
        users.rows.forEach(user => {
            const author = authors.rows.find(a => a.user_id == user.id);
            if (user.role === 'creator' && !author) {
                console.log(`WARNING: User ${user.email} (ID: ${user.id}) is a CREATOR but has NO Author record.`);
            } else if (author) {
                console.log(`User ${user.email} is linked to Author ${author.name} (ID: ${author.id}).`);
            }
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

debugUsers();
