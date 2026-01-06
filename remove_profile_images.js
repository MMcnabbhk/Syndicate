
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

async function removeProfileImages() {
    try {
        console.log("Checking for profile images in works...");

        const tables = ['novels', 'audiobooks', 'short_stories', 'poems', 'visual_arts'];
        let found = false;

        for (const table of tables) {
            const [rows] = await pool.execute(
                `SELECT id, title, cover_image_url FROM ${table} WHERE cover_image_url LIKE '%profile%'`
            );

            if (rows.length > 0) {
                found = true;
                console.log(`Found ${rows.length} works in ${table} with profile images:`);
                rows.forEach(r => console.log(` - ID: ${r.id}, Title: ${r.title}, URL: ${r.cover_image_url}`));

                // Update to a safe default
                const safeCover = '/assets/cover_chronomancer.png';
                // Using cover_chronomancer as a safe fallback for now
                for (const row of rows) {
                    await pool.execute(
                        `UPDATE ${table} SET cover_image_url = ? WHERE id = ?`,
                        [safeCover, row.id]
                    );
                    console.log(`   Updated ID ${row.id} to use ${safeCover}`);
                }
            }
        }

        if (!found) {
            console.log("No profile images found in works.");
        }

    } catch (err) {
        console.error("Failed:", err);
    } finally {
        await pool.end();
    }
}

removeProfileImages();
