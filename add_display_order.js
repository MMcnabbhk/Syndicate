
import db from './src/server/db.js';

async function addDisplayOrderColumn() {
    const tables = ['Novels', 'ShortStories', 'Poems', 'Audiobooks'];

    for (const table of tables) {
        try {
            // Check if column exists
            const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE 'display_order'`);
            if (columns.length === 0) {
                await db.query(`ALTER TABLE ${table} ADD COLUMN display_order INT DEFAULT 0`);
                console.log(`✅ Added display_order to ${table}`);
            } else {
                console.log(`ℹ️ display_order already exists in ${table}`);
            }
        } catch (err) {
            console.error(`❌ Error updating ${table}:`, err);
        }
    }
    process.exit(0);
}

addDisplayOrderColumn();
