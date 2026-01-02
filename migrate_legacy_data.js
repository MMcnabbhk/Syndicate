
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfigValues = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
};

async function migrateData() {
    let sourceConn;
    let targetConn;

    try {
        // Source Connection (book_site)
        sourceConn = await mysql.createConnection({ ...dbConfigValues, database: 'book_site' });
        console.log("Connected to source DB: book_site");

        // Target Connection (serialized_novels)
        targetConn = await mysql.createConnection({ ...dbConfigValues, database: 'serialized_novels' });
        console.log("Connected to target DB: serialized_novels");

        // 1. Migrate Users (and create table)
        console.log("Migrating Users...");
        const [users] = await sourceConn.query("SELECT * FROM users");

        // Get Create Table info to duplicate schema
        const [userSchema] = await sourceConn.query("SHOW CREATE TABLE users");
        const createTableSQL = userSchema[0]['Create Table'];

        // Remove 'CREATE TABLE' and 'users' to make it safe if we want to adjust, 
        // but easier to just run it on target if it doesn't exist.
        // The Create Table SQL usually contains `CREATE TABLE 'users' ...`
        await targetConn.query(`DROP TABLE IF EXISTS users`); // clear for clean migration
        await targetConn.query(createTableSQL);

        for (const user of users) {
            await targetConn.query("INSERT INTO users SET ?", user);
        }
        console.log(`Migrated ${users.length} users.`);


        // 2. Migrate Authors (Merge/Insert)
        console.log("Migrating Authors...");
        const [authors] = await sourceConn.query("SELECT * FROM authors");
        for (const author of authors) {
            // Stringify JSON fields if they are objects
            const authorData = { ...author };
            if (typeof authorData.socials === 'object' && authorData.socials !== null) {
                authorData.socials = JSON.stringify(authorData.socials);
            }
            // Add other fields that might be JSON in source but text in target, or vice versa if mysql2 doesn't handle it
            // Based on error: video_introductions
            if (authorData.video_introductions && typeof authorData.video_introductions === 'object') {
                authorData.video_introductions = JSON.stringify(authorData.video_introductions);
            }
            if (authorData.profile_images && typeof authorData.profile_images === 'object') {
                authorData.profile_images = JSON.stringify(authorData.profile_images);
            }
            if (authorData.target_gender && typeof authorData.target_gender === 'object') {
                authorData.target_gender = JSON.stringify(authorData.target_gender);
            }
            if (authorData.target_age && typeof authorData.target_age === 'object') {
                authorData.target_age = JSON.stringify(authorData.target_age);
            }
            if (authorData.target_income && typeof authorData.target_income === 'object') {
                authorData.target_income = JSON.stringify(authorData.target_income);
            }
            if (authorData.target_education && typeof authorData.target_education === 'object') {
                authorData.target_education = JSON.stringify(authorData.target_education);
            }

            // Check existence
            const [exists] = await targetConn.query("SELECT id FROM authors WHERE id = ?", [author.id]);
            if (exists.length === 0) {
                await targetConn.query("INSERT INTO authors SET ?", authorData);
            } else {
                await targetConn.query("UPDATE authors SET ? WHERE id = ?", [authorData, author.id]);
            }
        }
        console.log(`Migrated ${authors.length} authors.`);

        // 3. Migrate Novels (Merge/Insert - careful not to overwrite b1 with old data if b1 changes were important, 
        // but likely old data is better + my manual b1 freq update)
        console.log("Migrating Novels...");
        const [novels] = await sourceConn.query("SELECT * FROM novels");

        // We added 'frequency' column to serialized_novels.novels, but book_site.novels might not have it.
        // We need to handle that.

        for (const novel of novels) {
            const [exists] = await targetConn.query("SELECT id FROM novels WHERE id = ?", [novel.id]);

            // If novel is b1, we might want to preserve the 'frequency' if the incoming data doesn't have it.
            // Actually, I'll just update fields that exist in the source, and default the rest.

            if (exists.length === 0) {
                await targetConn.query("INSERT INTO novels SET ?", novel);
            } else {
                // Don't overwrite b1 completely if we want to keep specific manual tweaks, 
                // but for restoration, overwriting is safer to match old state, 
                // EXCEPT for the new 'frequency' column which source lacks.
                // UPDATE SET ? ignores keys not in the object? No, it sets them.
                // Source novel object won't have 'frequency' key, so it won't be updated/overwritten to null usually.
                await targetConn.query("UPDATE novels SET ? WHERE id = ?", [novel, novel.id]);
            }
        }
        console.log(`Migrated ${novels.length} novels.`);

        // Re-apply Frequency for b1 because the update above might have ignored it (good) or we just want to be sure
        await targetConn.query("UPDATE novels SET frequency = 'Every 3 Days' WHERE id = 'b1'");


        // 4. Migrate Other Content (Short Stories, Poems, Audiobooks, Collections)
        // I should check if these tables exist in target. created via schema.sql? No, schema.sql only had authors, novels, chapters.
        // I need to create them using source schema.

        const otherTables = ['short_stories', 'poems', 'audiobooks', 'poetry_collections', 'poetry_collection_items', 'audiobook_chapters'];

        for (const table of otherTables) {
            try {
                console.log(`Migrating ${table}...`);
                const [schema] = await sourceConn.query(`SHOW CREATE TABLE ${table}`);
                const createSQL = schema[0]['Create Table'];

                await targetConn.query(`DROP TABLE IF EXISTS ${table}`);
                await targetConn.query(createSQL);

                const [rows] = await sourceConn.query(`SELECT * FROM ${table}`);
                for (const row of rows) {
                    await targetConn.query(`INSERT INTO ${table} SET ?`, row);
                }
                console.log(`Migrated ${rows.length} rows for ${table}.`);
            } catch (err) {
                console.warn(`Skipping ${table} (maybe doesn't exist in source):`, err.message);
            }
        }


    } catch (err) {
        console.error("Migration Error:", err);
    } finally {
        if (sourceConn) await sourceConn.end();
        if (targetConn) await targetConn.end();
    }
}

migrateData();
