
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding external_url column to chapters table...');
        // Check if column exists
        const [rows] = await connection.query("SHOW COLUMNS FROM chapters LIKE 'external_url'");
        if (rows.length === 0) {
            await connection.query("ALTER TABLE chapters ADD COLUMN external_url VARCHAR(2048) DEFAULT NULL");
            console.log('Column external_url added successfully.');
        } else {
            console.log('Column external_url already exists.');
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrate();
