
import db from './src/server/db.js';

async function fixLink() {
    try {
        console.log('Linking Author ID 1 (Michael James) to User ID 1 (michael@syndicate.com)...');
        await db.query('UPDATE authors SET user_id = ? WHERE id = ?', ['1', '1']);
        console.log('Update complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixLink();
