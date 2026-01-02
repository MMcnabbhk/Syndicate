
import db from './src/server/db.js';

async function reassignWorks() {
    const OLD_ID = '1';
    const NEW_ID = 'd3993ab0-2a72-4f1d-b676-cd15051fae50';

    console.log(`--- Reassigning Works from ${OLD_ID} to ${NEW_ID} ---`);

    async function safeUpdate(tableName) {
        try {
            // Check if table exists
            const { rows: tables } = await db.query(`SHOW TABLES LIKE '${tableName}'`);
            if (tables.length === 0) {
                console.log(`Skipping ${tableName}: Table not found.`);
                return;
            }

            // Perform Update
            // db.query returns { rows }
            // For UPDATE, 'rows' is the ResultSetHeader
            const { rows: result } = await db.query(`UPDATE ${tableName} SET author_id = ? WHERE author_id = ?`, [NEW_ID, OLD_ID]);

            console.log(`Updated ${tableName}: ${result.affectedRows} rows.`);

        } catch (err) {
            console.log(`Error updating ${tableName}: ${err.message}`);
        }
    }

    await safeUpdate('novels');
    await safeUpdate('short_stories');
    await safeUpdate('audiobooks');
    await safeUpdate('poems');

    // Also check for 'works' table if that's a thing? No, from earlier checks we saw 'novels' exists.

    console.log('--- Reassignment Complete ---');
    process.exit(0);
}

reassignWorks();
