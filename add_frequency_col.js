import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'serialized_novels'
};

async function addFrequencyColumn() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        const [columns] = await connection.query("SHOW COLUMNS FROM novels LIKE 'frequency'");
        if (columns.length === 0) {
            console.log("Adding 'frequency' column...");
            await connection.query("ALTER TABLE novels ADD COLUMN frequency VARCHAR(50) DEFAULT 'Daily'");
            console.log("Column added.");
        } else {
            console.log("'frequency' column already exists.");
        }

        console.log("Updating b1 to 'Every 3 Days'...");
        await connection.query("UPDATE novels SET frequency = 'Every 3 Days' WHERE id = 'b1'"); // Setting a specific one to test

        await connection.end();
    } catch (err) {
        console.error("Error:", err);
    }
}

addFrequencyColumn();
