
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
};

async function initDB() {
    let connection;
    try {
        // Connect without database selected to create it
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL server.");

        await connection.query("CREATE DATABASE IF NOT EXISTS serialized_novels");
        console.log("Database serialized_novels created/checked.");

        await connection.changeUser({ database: 'serialized_novels' });
        console.log("Switched to serialized_novels.");

        // Create Authors table
        const authorsSql = `
            CREATE TABLE IF NOT EXISTS authors (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                user_id VARCHAR(255),
                bio TEXT,
                profile_image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(authorsSql);
        console.log("Authors table ready.");

        // Create Novels table
        const novelsSql = `
            CREATE TABLE IF NOT EXISTS novels (
                id VARCHAR(255) PRIMARY KEY,
                author_id VARCHAR(255),
                title VARCHAR(255),
                description TEXT,
                cover_image_url VARCHAR(255),
                status VARCHAR(50),
                price_monthly DECIMAL(10, 2),
                published_at DATETIME,
                subscribers_count INT DEFAULT 0,
                lifetime_earnings DECIMAL(10, 2) DEFAULT 0.00,
                genre VARCHAR(100),
                frequency VARCHAR(50),
                FOREIGN KEY (author_id) REFERENCES authors(id)
            )
        `;
        await connection.query(novelsSql);
        console.log("Novels table ready.");

        // Create Chapters table
        const chaptersSql = `
            CREATE TABLE IF NOT EXISTS chapters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                novel_id VARCHAR(255),
                title VARCHAR(255),
                chapter_number INT,
                content_html TEXT,
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (novel_id) REFERENCES novels(id)
            )
        `;
        await connection.query(chaptersSql);
        console.log("Chapters table ready.");

    } catch (err) {
        console.error("Error initializing DB:", err);
    } finally {
        if (connection) await connection.end();
    }
}

initDB();
