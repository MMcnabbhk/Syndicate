
import db from './src/server/db.js';
import User from './src/server/models/User.js';

async function testUserFind() {
    try {
        console.log('Testing User.findById...');
        // We know 'demo-user-id' was in notifications, but does a user exist with that ID?
        // Let's first list all users to get a valid ID or see if empty.
        const users = await db.query('SELECT * FROM users LIMIT 1');
        if (users.rows.length === 0) {
            console.log('No users found in DB.');
        } else {
            const userId = users.rows[0].id;
            console.log('Found user ID:', userId);

            const user = await User.findById(userId);
            console.log('User.findById result:', user);
        }
        process.exit(0);
    } catch (error) {
        console.error('User.findById failed:', error);
        process.exit(1);
    }
}

testUserFind();
