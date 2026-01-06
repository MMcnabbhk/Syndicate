
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

async function testFeed() {
    try {
        const queries = [];
        const types = [
            { table: 'novels', type: 'Novel' },
            { table: 'audiobooks', type: 'Audiobook' },
            { table: 'short_stories', type: 'Short Story' },
            { table: 'poems', type: 'Poem' },
            { table: 'visual_arts', type: 'Visual Art' }
        ];

        types.forEach(({ table, type }) => {
            queries.push(`
                SELECT 
                    t.id, 
                    t.title, 
                    '${type}' as type, 
                    t.cover_image_url, 
                    t.author_id,
                    a.name as author_name,
                    t.published_at,
                    (
                        SELECT MAX(created_at) 
                        FROM subscriptions 
                        WHERE work_id = CASE WHEN '${table}' = 'novels' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'audiobooks' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'short_stories' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'poems' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'visual_arts' THEN t.id ELSE NULL END 
                    ) as last_sub,
                    (
                        SELECT MAX(created_at) 
                        FROM contributions 
                        WHERE work_id = CASE WHEN '${table}' = 'novels' THEN t.id ELSE NULL END 
                           OR work_id = CASE WHEN '${table}' = 'audiobooks' THEN t.id ELSE NULL END
                    ) as last_contribution
                FROM ${table} t
                LEFT JOIN authors a ON t.author_id = a.id
                WHERE t.status = 'published' OR t.status = 'active' OR t.status IS NULL
            `);
        });

        const sql = `
            SELECT * FROM (
                ${queries.join(' UNION ALL ')}
            ) as all_works
            ORDER BY GREATEST(
                COALESCE(published_at, '1970-01-01'), 
                COALESCE(last_sub, '1970-01-01'), 
                COALESCE(last_contribution, '1970-01-01')
            ) DESC
            LIMIT 60
        `;

        console.log("Running FULL Union Query...");
        const [rows] = await pool.query(sql);
        console.log(`Fetched ${rows.length} rows from FULL query.`);
        console.log("First row example:", rows[0]);

    } catch (err) {
        console.error("Query Failed:", err);
    } finally {
        await pool.end();
    }
}

testFeed();
