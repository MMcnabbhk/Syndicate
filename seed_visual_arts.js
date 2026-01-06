
import db from './src/server/db.js';
import VisualArt from './src/server/models/VisualArt.js';

const mockData = [
    {
        title: "Urban Decay",
        description: "A series of photographs capturing the beauty in urban decay.",
        cover_image_url: "https://via.placeholder.com/800x1200?text=Urban+Decay",
        genre: "Photography",
        status: "published",
        price_monthly: 5.00,
        author_id: 1 // Assuming author with ID 1 exists
    },
    {
        title: "Neon Dreams",
        description: "Digital art exploring cyberpunk aesthetics.",
        cover_image_url: "https://via.placeholder.com/800x1200?text=Neon+Dreams",
        genre: "Digital Art",
        status: "published",
        price_monthly: 3.00,
        author_id: 1
    },
    {
        title: "Abstract Thoughts",
        description: "Oil painting on canvas.",
        cover_image_url: "https://via.placeholder.com/800x1200?text=Abstract+Thoughts",
        genre: "Painting",
        status: "published",
        price_monthly: 10.00,
        author_id: 1
    },
    {
        title: "Charcoal Portraits",
        description: "Sketches of strangers.",
        cover_image_url: "https://via.placeholder.com/800x1200?text=Charcoal+Portraits",
        genre: "Drawing",
        status: "published",
        price_monthly: 2.00,
        author_id: 1
    },
    {
        title: "Woodblock Prints",
        description: "Traditional Japanese woodblock printing techniques.",
        cover_image_url: "https://via.placeholder.com/800x1200?text=Woodblock+Prints",
        genre: "Printmaking",
        status: "published",
        price_monthly: 4.00,
        author_id: 1
    },
    {
        title: "Nature's Fury",
        description: "Storm photography.",
        cover_image_url: "https://via.placeholder.com/800x1200?text=Nature's+Fury",
        genre: "Photography",
        status: "published",
        price_monthly: 5.00,
        author_id: 1
    }
];

async function seed() {
    try {
        console.log("Creating visual_arts table...");

        await db.query(`
            CREATE TABLE IF NOT EXISTS visual_arts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                author_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                cover_image_url VARCHAR(255),
                status VARCHAR(50) DEFAULT 'draft',
                published_at DATETIME,
                price_monthly DECIMAL(10, 2) DEFAULT 0.00,
                subscribers_count INT DEFAULT 0,
                lifetime_earnings DECIMAL(10, 2) DEFAULT 0.00,
                genre VARCHAR(100),
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log("Seeding visual arts...");

        // Clear existing data to avoid duplicates if running multiple times (optional, but good for idempotent testing)
        // await db.query('TRUNCATE TABLE visual_arts'); 

        for (const item of mockData) {
            await VisualArt.create(item);
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
