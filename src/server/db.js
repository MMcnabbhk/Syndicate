// src/server/db.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create a MySQL connection pool. Adjust the configuration as needed for your environment.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME || 'book_site',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export a simple query helper that returns rows.
const db = {
    query: async (sql, params) => {
        const [rows] = await pool.execute(sql, params);
        return { rows };
    },
};

export default db;
