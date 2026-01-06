
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'serialized_novels'
};

async function updateSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database for schema update.");

        const tableUpdates = [
            {
                table: 'novels',
                columns: [
                    "frequency VARCHAR(50) DEFAULT 'Daily'",
                    "full_download BOOLEAN DEFAULT FALSE",
                    "goodreads_url TEXT",
                    "amazon_url TEXT",
                    "spotify_url TEXT",
                    "rating DECIMAL(3,1) DEFAULT 0",
                    "length VARCHAR(50)",
                    "short_description TEXT"
                ]
            },
            {
                table: 'short_stories',
                columns: [
                    "full_download BOOLEAN DEFAULT FALSE",
                    "goodreads_url TEXT",
                    "amazon_url TEXT",
                    "spotify_url TEXT",
                    "rating DECIMAL(3,1) DEFAULT 0",
                    "length VARCHAR(50)",
                    "short_description TEXT"
                ]
            },
            {
                table: 'poems',
                columns: [
                    "full_download BOOLEAN DEFAULT FALSE",
                    "goodreads_url TEXT",
                    "amazon_url TEXT",
                    "spotify_url TEXT",
                    "rating DECIMAL(3,1) DEFAULT 0",
                    "length VARCHAR(50)",
                    "short_description TEXT"
                ]
            },
            {
                table: 'audiobooks',
                columns: [
                    "full_download BOOLEAN DEFAULT FALSE",
                    "goodreads_url TEXT",
                    "amazon_url TEXT",
                    "spotify_url TEXT",
                    "rating DECIMAL(3,1) DEFAULT 0",
                    "short_description TEXT"
                ]
            },
            {
                table: 'audiobook_chapters',
                columns: [
                    "spotify_url TEXT"
                ]
            }
        ];

        for (const update of tableUpdates) {
            const [existingColumns] = await connection.query(`SHOW COLUMNS FROM ${update.table}`);
            const existingColumnNames = existingColumns.map(col => col.Field);

            for (const columnDef of update.columns) {
                const columnName = columnDef.split(' ')[0];
                if (!existingColumnNames.includes(columnName)) {
                    console.log(`Adding column '${columnName}' to table '${update.table}'...`);
                    await connection.query(`ALTER TABLE ${update.table} ADD COLUMN ${columnDef}`);
                } else {
                    console.log(`Column '${columnName}' already exists in table '${update.table}'.`);
                }
            }
        }

        // Fix author_id type in works tables to match authors.id (INT) if it was inadvertently created as VARCHAR or something else in previous steps, 
        // but assuming current schema is okay based on existing functionality. 
        // We will focus strictly on the audit findings.

        console.log("Schema update complete.");

    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
