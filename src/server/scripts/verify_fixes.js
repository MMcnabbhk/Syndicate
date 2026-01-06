
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import Novel from '../models/Novel.js';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'serialized_novels'
};

async function verifyFixes() {
    let connection;
    try {
        console.log("Starting verification...");

        // 1. Create a test Novel with new fields
        const testData = {
            author_id: '1', // Assuming author with ID 1 exists, or use a placeholder if constraints allow
            title: 'Test Novel Remediation',
            description: 'Testing new columns',
            cover_image_url: 'http://example.com/cover.jpg',
            status: 'draft',
            price_monthly: 4.99,
            frequency: 'Every 3 Days', // The field that was broken
            full_download: true,
            goodreads_url: 'http://goodreads.com/test',
            amazon_url: 'http://amazon.com/test',
            spotify_url: 'http://spotify.com/test',
            rating: 4.5,
            length: '300 pages',
            short_description: 'Short desc',
            genre: 'Sci-Fi'
        };

        console.log("Creating test Novel...");
        // Note: Author ID 1 might not exist, checking for an existing author first would be safer but let's try.
        // If it fails on foreign key, we'll need to fetch an author first.

        // Let's actually find an author first to be safe
        connection = await mysql.createConnection(dbConfig);
        const [authors] = await connection.query('SELECT id FROM authors LIMIT 1');
        if (authors.length > 0) {
            testData.author_id = authors[0].id; // Use real author ID
        } else {
            console.log("No authors found, cannot create novel linked to author. Skipping FK check or allow failure.");
            // Proceeding might fail if FK exists.
        }
        await connection.end();

        const result = await Novel.create(testData);
        // Novel.create returns result object from mysql2, insertId is usually there
        const newId = result.insertId;
        console.log(`Created Novel with ID: ${newId}`);

        // 2. Fetch and Verify
        console.log("Fetching Novel to verify persistence...");
        const fetchedNovel = await Novel.findById(newId);

        let success = true;
        const checks = {
            frequency: 'Every 3 Days',
            full_download: 1, // specific to mysql boolean return
            goodreads_url: 'http://goodreads.com/test',
            rating: '4.5', // decimals often return as string
            length: '300 pages'
        };

        for (const [key, expected] of Object.entries(checks)) {
            let actual = fetchedNovel[key];
            if (key === 'full_download') actual = actual ? 1 : 0;
            if (key === 'rating') actual = String(actual);

            if (actual != expected) {
                console.error(`❌ Mismatch for ${key}: Expected '${expected}', got '${actual}'`);
                success = false;
            } else {
                console.log(`✅ ${key} matches`);
            }
        }

        // 3. Update and Verify
        console.log("Updating Novel...");
        const updateData = {
            ...testData,
            frequency: 'Weekly',
            full_download: false
        };
        await Novel.update(newId, updateData);

        const updatedNovel = await Novel.findById(newId);
        if (updatedNovel.frequency !== 'Weekly') {
            console.error(`❌ Update Mismatch for frequency: Expected 'Weekly', got '${updatedNovel.frequency}'`);
            success = false;
        } else {
            console.log(`✅ Update frequency matches`);
        }

        // 4. Cleanup
        console.log("Cleaning up...");
        await Novel.delete(newId);

        if (success) {
            console.log("🎉 Verification PASSED!");
        } else {
            console.error("⛔ Verification FAILED.");
        }
        process.exit(success ? 0 : 1);

    } catch (err) {
        console.error("Verification Error:", err);
        process.exit(1);
    }
}

console.log("Script loaded.");
verifyFixes();
