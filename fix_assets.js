
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME || 'serialized_novels',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function fixAssets() {
    try {
        console.log("Fixing broken assets...");

        // Fix 1: Update the novel with example.com link
        // ID: 1421aee6-e5d9-4730-9cf9-fa00392d52c2
        // Use cover_chronomancer.png
        const [res1] = await pool.execute(
            "UPDATE novels SET cover_image_url = '/assets/cover_chronomancer.png' WHERE cover_image_url LIKE '%example.com%'"
        );
        console.log(`Updated ${res1.affectedRows} novels (example.com -> chronomancer).`);

        // Fix 2: Update Neon Dreams visual art
        // ID: 2
        // Use cover_neon.png
        await pool.execute("UPDATE visual_arts SET cover_image_url = '/assets/cover_neon.png' WHERE id = 2");

        // Fix other Visual Arts placeholders
        const updates = [
            { id: 1, url: '/assets/cover_deep.png' }, // Urban Decay
            { id: 3, url: '/assets/cover_chronomancer.png' }, // Abstract Thoughts
            { id: 4, url: '/assets/michael_james_profile.jpg' }, // Charcoal Portraits
            { id: 5, url: '/assets/island_thieves_new.jpg' }, // Woodblock Prints
            { id: 6, url: '/assets/cover_water_washes.jpg' }  // Nature's Fury
        ];

        for (const update of updates) {
            const [res] = await pool.execute(
                "UPDATE visual_arts SET cover_image_url = ? WHERE id = ?",
                [update.url, update.id]
            );
            console.log(`Updated ID ${update.id}: ${res.affectedRows} rows.`);
        }

    } catch (err) {
        console.error("Update Failed:", err);
    } finally {
        await pool.end();
    }
}

fixAssets();
