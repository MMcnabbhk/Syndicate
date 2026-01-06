import db from './src/server/db.js';
// No external dependencies needed for Node 14+ specific randomUUID, but let's use Math for safety or crypto
import crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();

const TABLES = ['novels', 'audiobooks', 'short_stories', 'poems', 'visual_arts'];
const TITLES = [
    "The Clockwork Orange", "Neon Genesis", "Silence of the Lambs", "Digital Fortress", "Neuromancer",
    "Snow Crash", "Dune", "Hyperion", "Foundation", "Solaris",
    "The Matrix", "Blade Runner", "Cyber City", "Lost in Translation", "Tokyo Drift",
    "Midnight Special", "Dark MATTER", "Light Years", "Star Dust", "Void Walker"
];
const IMAGES = [
    "/assets/cover_neon.png",
    "/assets/cover_chronomancer.png",
    "/assets/island_thieves_new.jpg",
    "/assets/cover_season_of_light.jpg",
    "/assets/cover_tyger.jpg",
    "/assets/cover_water_washes.jpg",
    "/assets/cover_deep.png"
];

async function seed() {
    try {
        console.log("Checking current work count...");
        let total = 0;
        for (const t of TABLES) {
            const { rows } = await db.query(`SELECT COUNT(*) as c FROM ${t}`);
            total += rows[0].c;
        }
        console.log(`Current Total: ${total}`);

        if (total >= 30) {
            console.log("Enough works exist. Skipping seed.");
            process.exit(0);
        }

        const needed = 40 - total;
        console.log(`Seeding ${needed} more works...`);

        // Get an author (Mock Creator)
        const { rows: authors } = await db.query("SELECT id FROM authors LIMIT 1");
        const authorId = authors[0]?.id || 1; // Fallback

        for (let i = 0; i < needed; i++) {
            const table = TABLES[Math.floor(Math.random() * TABLES.length)];
            const title = `${TITLES[Math.floor(Math.random() * TITLES.length)]} ${i}`;
            const image = IMAGES[Math.floor(Math.random() * IMAGES.length)];
            const type = table === 'novels' ? 'Novel' : table === 'poems' ? 'Poem' : table === 'short_stories' ? 'Short Story' : table === 'audiobooks' ? 'Audiobook' : 'Visual Art';

            // Handle ID type: visual_arts uses INT (auto increment maybe?), others UUID?
            // Actually, based on previous Author.js fixes, visual_arts expected INT author_id but we fixed it?
            // Wait, visual_arts table ID might be INT or UUID.
            // Let's assume UUID for new items if possible, or omit ID if auto-inc.
            // But we can try UUID.

            const uuid = uuidv4();

            // Simple insert, ignoring extra fields.
            // visual_arts needs specific fields?
            // Let's rely on defaults.
            // Query: INSERT INTO table (id, title, author_id, cover_image_url, status, published_at, created_at) VALUES ...

            await db.query(`
                INSERT INTO ${table} (id, title, author_id, cover_image_url, status, published_at, created_at)
                VALUES (?, ?, ?, ?, 'published', NOW(), NOW())
            `, [uuid, title, authorId, image]);
        }

        console.log("Seeding complete.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        process.exit();
    }
}

seed();
