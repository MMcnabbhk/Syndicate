import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkData() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'serialized_novels'
    });

    const [authors] = await conn.query("SELECT id, name FROM authors");
    const [novels] = await conn.query("SELECT id, title, author_id FROM novels");
    const [users] = await conn.query("SELECT id, email FROM users");
    const [chapters] = await conn.query("SELECT COUNT(*) as count FROM chapters");

    console.log("✅ Database Verification:");
    console.log(`\nAuthors (${authors.length}):`);
    authors.forEach(a => console.log(`  - ${a.id}: ${a.name}`));

    console.log(`\nNovels (${novels.length}):`);
    novels.forEach(n => console.log(`  - ${n.id}: ${n.title} (${n.author_id})`));

    console.log(`\nUsers: ${users.length}`);
    console.log(`Chapters: ${chapters[0].count}`);

    await conn.end();
}

checkData();
