import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkNovels() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'serialized_novels'
    });

    const [novels] = await conn.query("SELECT id, title, author_id FROM novels WHERE author_id = '1'");

    console.log(`\n📚 Novels for Author 1:`);
    if (novels.length === 0) {
        console.log("❌ NO NOVELS FOUND!");
    } else {
        novels.forEach(n => console.log(`  - ${n.id}: ${n.title}`));
    }

    const [allNovels] = await conn.query("SELECT id, title, author_id FROM novels");
    console.log(`\n📚 All Novels in DB:`);
    allNovels.forEach(n => console.log(`  - ${n.id}: ${n.title} (author_id: ${n.author_id})`));

    await conn.end();
}

checkNovels();
