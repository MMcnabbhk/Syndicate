
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'serialized_novels'
};

async function populateNovel() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database:", dbConfig.database);

        const novel = {
            id: 'b1',
            title: 'Island Of The Thieves',
            author_id: '1',
            description: 'In a world where history is currency, a young orphan discovers a map to the lost Island of the Thieves. But he is not the only one looking for it.',
            cover_image_url: '/assets/island_thieves_new.jpg',
            status: 'published',
            price_monthly: 14.99,
            published_at: new Date('2025-05-14 16:00:00'),
            subscribers_count: 0,
            lifetime_earnings: 0,
            genre: 'Adventure',
            frequency: 'Every 3 Days'
        };

        // Ensure Author 1 exists FIRST
        const [authors] = await connection.query("SELECT * FROM authors WHERE id = '1'");
        if (authors.length === 0) {
            console.log("Author 1 not found. Inserting...");
            await connection.query("INSERT INTO authors (id, name, user_id) VALUES ('1', 'Michael James', 'user_1')");
            console.log("Author inserted.");
        }

        // Check if novel exists
        const [rows] = await connection.query("SELECT * FROM novels WHERE id = ?", [novel.id]);

        if (rows.length === 0) {
            console.log("Novel b1 not found. Inserting...");
            await connection.query("INSERT INTO novels SET ?", novel);
            console.log("Novel inserted.");
        } else {
            console.log("Novel b1 already exists. Updating...");
            await connection.query("UPDATE novels SET ? WHERE id = ?", [novel, novel.id]);
            console.log("Novel updated.");
        }

        await connection.end();
    } catch (err) {
        console.error("Error:", err);
    }
}

populateNovel();
