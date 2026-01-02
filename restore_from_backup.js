
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
};

async function restoreData() {
    let sourceConn, targetConn;

    try {
        sourceConn = await mysql.createConnection({ ...dbConfig, database: 'book_site' });
        targetConn = await mysql.createConnection({ ...dbConfig, database: 'serialized_novels' });

        console.log("Connected to both databases.");

        // Helper function to get column names for a table
        async function getColumns(conn, table) {
            const [cols] = await conn.query(`SHOW COLUMNS FROM ${table}`);
            return cols.map(c => c.Field);
        }

        // Helper to insert with column filtering
        async function migrateTable(tableName, { dropAndRecreate = false, jsonFields = [] } = {}) {
            console.log(`\nMigrating ${tableName}...`);

            try {
                if (dropAndRecreate) {
                    const [schema] = await sourceConn.query(`SHOW CREATE TABLE ${tableName}`);
                    await targetConn.query(`DROP TABLE IF EXISTS ${tableName}`);
                    await targetConn.query(schema[0]['Create Table']);
                    console.log(`  Recreated ${tableName} from source schema`);
                }

                const [sourceRows] = await sourceConn.query(`SELECT * FROM ${tableName}`);
                if (sourceRows.length === 0) {
                    console.log(`  No rows to migrate in ${tableName}`);
                    return;
                }

                const targetCols = await getColumns(targetConn, tableName);

                for (const row of sourceRows) {
                    // Filter to only include columns that exist in target
                    const filteredRow = {};
                    for (const col of targetCols) {
                        if (row.hasOwnProperty(col)) {
                            let value = row[col];
                            // Stringify JSON fields if needed
                            if (jsonFields.includes(col) && typeof value === 'object' && value !== null) {
                                value = JSON.stringify(value);
                            }
                            filteredRow[col] = value;
                        }
                    }

                    await targetConn.query(`INSERT INTO ${tableName} SET ? ON DUPLICATE KEY UPDATE ?`, [filteredRow, filteredRow]);
                }

                console.log(`  Migrated ${sourceRows.length} rows`);
            } catch (err) {
                console.warn(`  Error migrating ${tableName}:`, err.message);
            }
        }

        // Migrate in dependency order
        await migrateTable('users', { dropAndRecreate: true });

        await migrateTable('authors', {
            jsonFields: ['socials', 'video_introductions', 'profile_images', 'target_gender', 'target_age', 'target_income', 'target_education']
        });

        await migrateTable('novels');

        // Apply manual frequency update for b1
        await targetConn.query("UPDATE novels SET frequency = 'Every 3 Days' WHERE id = 'b1'");
        console.log("  Set frequency for b1");

        // Migrate other content types
        const otherTables = ['short_stories', 'poems', 'audiobooks', 'poetry_collections', 'poetry_collection_items', 'audiobook_chapters'];
        for (const table of otherTables) {
            try {
                await migrateTable(table, { dropAndRecreate: true });
            } catch (err) {
                console.log(`  Skipping ${table} (doesn't exist)`);
            }
        }

        console.log("\n✅ Migration complete!");

    } catch (err) {
        console.error("Fatal error:", err);
    } finally {
        if (sourceConn) await sourceConn.end();
        if (targetConn) await targetConn.end();
    }
}

restoreData();
