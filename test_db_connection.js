import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing DB interactions...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

try {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD, // undefined is fine if acceptable
        database: process.env.DB_NAME || 'book_site'
    });
    console.log('Successfully connected to the database.');
    const [rows] = await connection.execute('SELECT 1 as val');
    console.log('Query result:', rows);
    await connection.end();
} catch (error) {
    console.error('Database connection failed:', error.message);
}
