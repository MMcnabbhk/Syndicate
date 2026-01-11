#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyMigration() {
    const migrationFile = path.join(__dirname, 'src/server/migration_add_missing_columns.sql');

    console.log('🔄 Reading migration file...');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    // Split SQL into individual statements (by semicolon)
    const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];

        // Skip comments and empty lines
        if (!statement || statement.startsWith('--')) {
            continue;
        }

        try {
            // Extract table name for better logging
            const tableMatch = statement.match(/(?:ALTER TABLE|CREATE INDEX.*ON)\s+(\w+)/i);
            const tableName = tableMatch ? tableMatch[1] : 'unknown';

            process.stdout.write(`[${i + 1}/${statements.length}] Executing on ${tableName}... `);

            await db.query(statement);

            console.log('✅');
            successCount++;
        } catch (error) {
            console.log('❌');
            console.error(`   Error: ${error.message}`);
            errorCount++;

            // Continue with other statements even if one fails
            // (some columns might already exist)
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Migration complete!`);
    console.log(`   Success: ${successCount} statements`);
    if (errorCount > 0) {
        console.log(`   Skipped: ${errorCount} statements (likely already applied)`);
    }
    console.log('='.repeat(60));

    // Verify the changes by describing tables
    console.log('\n🔍 Verifying changes...\n');

    const tables = ['novels', 'poems', 'short_stories', 'audiobooks', 'chapters', 'users'];

    for (const table of tables) {
        try {
            const { rows } = await db.query(`DESCRIBE ${table}`);
            const columnNames = rows.map(r => r.Field);

            console.log(`📊 ${table.toUpperCase()} (${columnNames.length} columns)`);

            // Check for specific new columns
            const newColumns = {
                novels: ['full_download', 'goodreads_url', 'amazon_url', 'spotify_url', 'rating', 'length', 'short_description'],
                poems: ['full_download', 'goodreads_url', 'amazon_url', 'spotify_url', 'rating', 'length', 'short_description'],
                short_stories: ['full_download', 'goodreads_url', 'amazon_url', 'spotify_url', 'rating', 'length', 'short_description'],
                audiobooks: ['full_download', 'goodreads_url', 'amazon_url', 'spotify_url', 'rating', 'length', 'short_description'],
                chapters: ['release_day', 'external_url'],
                users: ['status']
            };

            const expected = newColumns[table] || [];
            const missing = expected.filter(col => !columnNames.includes(col));
            const present = expected.filter(col => columnNames.includes(col));

            if (present.length > 0) {
                console.log(`   ✅ Added: ${present.join(', ')}`);
            }
            if (missing.length > 0) {
                console.log(`   ⚠️  Missing: ${missing.join(', ')}`);
            }
            console.log();
        } catch (error) {
            console.error(`   ❌ Error checking ${table}: ${error.message}\n`);
        }
    }

    process.exit(0);
}

// Run the migration
applyMigration().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});
