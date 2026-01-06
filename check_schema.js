
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME || 'serialized_novels',
});

async function checkSchema() {
    try {
        const tables = ['novels', 'audiobooks', 'short_stories', 'poems', 'visual_arts'];
        for (const t of tables) {
            const [rows] = await pool.query(`SHOW CREATE TABLE ${t}`);
            console.log(`\n--- ${t} ---`);
            console.log(rows[0]['Create Table']);
        }

        // Also check authors ID type
        const [rows] = await pool.query(`SHOW CREATE TABLE authors`);
        console.log(`\n--- authors ---`);
        console.log(rows[0]['Create Table']);

        // Check the author I'm using
        const [authors] = await pool.query("SELECT * FROM authors LIMIT 1");
        console.log("\nSample Author:", authors[0]);

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
checkSchema();
