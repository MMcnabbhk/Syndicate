import 'dotenv/config';
import db from './src/server/db.js';
import { BOOKS, AUDIOBOOKS } from './src/data/mockData.js';

async function syncDatabase() {
    try {
        console.log("Starting database synchronization with mock data...\n");

        // Sync Novels (Text Books)
        console.log("Syncing novels...");
        for (const book of BOOKS) {
            try {
                // Check if record exists
                const { rows } = await db.query('SELECT id FROM novels WHERE id = ?', [book.id]);

                if (rows && rows.length > 0) {
                    // Update existing record
                    await db.query(
                        `UPDATE novels SET 
                            title = ?, 
                            description = ?, 
                            cover_image_url = ?, 
                            status = 'published',
                            price_monthly = ?
                        WHERE id = ?`,
                        [book.title, book.blurb, book.coverImage, book.priceFull, book.id]
                    );
                    console.log(`✓ Updated novel: ${book.title} (${book.id}) - Cover: ${book.coverImage}`);
                } else {
                    // Insert new record
                    await db.query(
                        `INSERT INTO novels (id, author_id, title, description, cover_image_url, status, price_monthly, published_at)
                        VALUES (?, 'a1', ?, ?, ?, 'published', ?, ?)`,
                        [book.id, book.title, book.blurb, book.coverImage, book.priceFull, book.releaseDate]
                    );
                    console.log(`✓ Inserted novel: ${book.title} (${book.id}) - Cover: ${book.coverImage}`);
                }
            } catch (err) {
                console.error(`✗ Error syncing novel ${book.id}:`, err.message);
            }
        }

        // Sync Audiobooks
        console.log("\nSyncing audiobooks...");
        for (const audiobook of AUDIOBOOKS) {
            try {
                const { rows } = await db.query('SELECT id FROM audiobooks WHERE id = ?', [audiobook.id]);

                if (rows && rows.length > 0) {
                    await db.query(
                        `UPDATE audiobooks SET 
                            title = ?, 
                            description = ?, 
                            cover_image_url = ?, 
                            narrator = ?,
                            duration = ?,
                            price = ?
                        WHERE id = ?`,
                        [audiobook.title, audiobook.blurb, audiobook.coverImage, audiobook.narrator, audiobook.length, audiobook.priceFull, audiobook.id]
                    );
                    console.log(`✓ Updated audiobook: ${audiobook.title} (${audiobook.id}) - Cover: ${audiobook.coverImage}`);
                } else {
                    await db.query(
                        `INSERT INTO audiobooks (id, author_id, title, description, cover_image_url, narrator, duration, price, published_at)
                        VALUES (?, 'a1', ?, ?, ?, ?, ?, ?, ?)`,
                        [audiobook.id, audiobook.title, audiobook.blurb, audiobook.coverImage, audiobook.narrator, audiobook.length, audiobook.priceFull, audiobook.releaseDate]
                    );
                    console.log(`✓ Inserted audiobook: ${audiobook.title} (${audiobook.id}) - Cover: ${audiobook.coverImage}`);
                }
            } catch (err) {
                console.error(`✗ Error syncing audiobook ${audiobook.id}:`, err.message);
            }
        }

        console.log("\n✓ Database synchronization complete!");

        // Verify Island of the Thieves records
        console.log("\nVerifying Island of the Thieves records:");
        const { rows: novels } = await db.query("SELECT id, title, cover_image_url FROM novels WHERE title LIKE '%Thieves%'");
        console.log("Novels:", novels);

        const { rows: audiobooks } = await db.query("SELECT id, title, cover_image_url FROM audiobooks WHERE title LIKE '%Thieves%'");
        console.log("Audiobooks:", audiobooks);

    } catch (err) {
        console.error("Error during database sync:", err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("\n⚠️  Database is not accessible. The application will use mock data only.");
            console.log("This is fine - the mock data has already been updated with the new cover image.");
        }
    } finally {
        process.exit();
    }
}

syncDatabase();
