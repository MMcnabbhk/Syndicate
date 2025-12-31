import 'dotenv/config';
import db from './src/server/db.js';

async function cleanup() {
    try {
        console.log("Checking novels...");
        const { rows: novels } = await db.query("SELECT * FROM novels WHERE title LIKE '%Thieves%'");
        console.log("Found novels:", novels);

        console.log("Checking audiobooks...");
        const { rows: audiobooks } = await db.query("SELECT * FROM audiobooks WHERE title LIKE '%Thieves%'");
        console.log("Found audiobooks:", audiobooks);

        console.log("Updating records...");
        const newImagePath = '/assets/cover_island_thieves_v4.jpg';

        await db.query("UPDATE novels SET cover_image_url = ? WHERE title LIKE '%Thieves%'", [newImagePath]);
        await db.query("UPDATE audiobooks SET cover_image_url = ? WHERE title LIKE '%Thieves%'", [newImagePath]);

        console.log("Successfully updated database records.");
    } catch (err) {
        console.error("Error during cleanup:", err);
    } finally {
        process.exit();
    }
}

cleanup();
