import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'serialized_novels',
    multipleStatements: true
};

async function createNotificationsTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL, -- 'system', 'release', 'money', 'comment', 'social'
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            );
        `;

        console.log('Creating notifications table...');
        await connection.query(createTableQuery);
        console.log('Notifications table created successfully.');

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) await connection.end();
    }
}

createNotificationsTable();
