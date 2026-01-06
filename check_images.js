
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME || 'serialized_novels',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function checkImages() {
    try {
        const queries = [];
        const tables = ['novels', 'audiobooks', 'short_stories', 'poems', 'visual_arts'];

        tables.forEach(table => {
            queries.push(`SELECT id, title, '${table}' as source_table, cover_image_url FROM ${table}`);
        });

        const sql = queries.join(' UNION ALL ');
        const [rows] = await pool.query(sql);

        console.log(`Checking ${rows.length} image links...`);

        const publicDir = path.join(__dirname, 'public');

        // Get all files in public/assets
        const assetsDir = path.join(publicDir, 'assets');
        let existingAssets = [];
        try {
            existingAssets = fs.readdirSync(assetsDir);
            console.log("Existing assets:", existingAssets);
        } catch (e) {
            console.error("Could not read assets dir:", e.message);
        }

        for (const row of rows) {
            const url = row.cover_image_url;
            if (!url) {
                console.log(`[MISSING] ID: ${row.id} (${row.source_table}) - No URL`);
                continue;
            }

            if (url.startsWith('http')) {
                console.log(`[EXTERNAL] ID: ${row.id} (${row.source_table}) - ${url}`);
                continue;
            }

            // Local link
            // Remove leading slash for join
            const relativePath = url.startsWith('/') ? url.slice(1) : url;
            const fullPath = path.join(publicDir, relativePath);

            console.log(`[Checking] ${fullPath}`);
            if (fs.existsSync(fullPath)) {
                console.log(`[OK] ID: ${row.id} (${row.source_table}) - ${url}`);
            } else {
                console.log(`[BROKEN] ID: ${row.id} (${row.source_table}) - ${url}`);
            }
        }

    } catch (err) {
        console.error("Query Failed:", err);
    } finally {
        await pool.end();
    }
}

checkImages();
