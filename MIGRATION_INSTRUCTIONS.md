# Migration Instructions

## Status: ⚠️ Ready to Apply (MySQL Server Required)

The migration file has been created and is ready to apply, but the MySQL server needs to be running first.

## Files Created

1. **`src/server/migration_add_missing_columns.sql`** - The migration SQL file
2. **`apply_migration.js`** - Automated migration script with verification
3. **`SCHEMA_REVIEW_REPORT.md`** - Detailed analysis of the issues
4. **This file** - Step-by-step instructions

## Current Database Configuration (from .env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=(empty)
DB_NAME=serialized_novels
```

## Steps to Apply the Migration

### Option 1: Start MySQL and Use Automated Script (Recommended)

1. **Start MySQL Server:**
   ```bash
   # On Linux/Mac:
   sudo service mysql start
   # or
   sudo systemctl start mysql
   # or
   sudo mysql.server start

   # On Windows:
   net start MySQL
   ```

2. **Run the automated migration script:**
   ```bash
   node apply_migration.js
   ```

   This script will:
   - Apply all migration statements
   - Show progress for each table
   - Verify columns were added
   - Provide a summary report

### Option 2: Manual MySQL Application

1. **Start MySQL Server** (see Option 1)

2. **Connect to MySQL:**
   ```bash
   mysql -u root -p serialized_novels
   # Press Enter when prompted for password (it's empty)
   ```

3. **Run the migration:**
   ```sql
   source src/server/migration_add_missing_columns.sql
   ```

4. **Verify the changes:**
   ```sql
   -- Check novels table
   DESCRIBE novels;

   -- Check for new columns
   SHOW COLUMNS FROM novels LIKE '%download%';
   SHOW COLUMNS FROM novels LIKE '%url%';
   ```

### Option 3: If MySQL is Running on a Different Host/Port

If your MySQL is running elsewhere (Docker, remote server, etc.):

1. **Update .env file** with correct connection details:
   ```bash
   DB_HOST=your-host
   DB_USER=your-user
   DB_PASSWORD=your-password
   DB_NAME=serialized_novels
   ```

2. **Run the automated script:**
   ```bash
   node apply_migration.js
   ```

## What Will Be Added

### All Work Tables (novels, poems, short_stories, audiobooks)
- `full_download` - BOOLEAN (allow full work downloads)
- `goodreads_url` - VARCHAR(2048) (Goodreads link)
- `amazon_url` - VARCHAR(2048) (Amazon link)
- `spotify_url` - VARCHAR(2048) (Spotify link)
- `rating` - DECIMAL(3,2) (average rating 0.00-5.00)
- `length` - VARCHAR(100) (reading time/word count)
- `short_description` - TEXT (brief synopsis)

### Chapters Table
- `release_day` - INT (scheduled release day offset)
- `external_url` - VARCHAR(2048) (external hosting URL)
- Index on `release_day`

### Users Table
- `status` - VARCHAR(50) (account status: active/suspended/deleted)
- Index on `status`

## Verification

After applying the migration, the automated script will show:
- ✅ Which columns were successfully added
- ⚠️ Which columns (if any) are still missing
- ❌ Any errors encountered

You should see output like:
```
📊 NOVELS (24 columns)
   ✅ Added: full_download, goodreads_url, amazon_url, spotify_url, rating, length, short_description

📊 CHAPTERS (9 columns)
   ✅ Added: release_day, external_url

📊 USERS (15 columns)
   ✅ Added: status
```

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
**Solution:** MySQL server is not running. Start MySQL (see Option 1 above).

### Error: "Access denied for user 'root'@'localhost'"
**Solution:**
1. Check your .env file has correct DB_USER and DB_PASSWORD
2. Or set password for MySQL root user:
   ```bash
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   ```

### Error: "Unknown database 'serialized_novels'"
**Solution:** Create the database first:
```bash
mysql -u root -e "CREATE DATABASE serialized_novels;"
```

### Error: "Duplicate column name 'X'"
**Solution:** This is expected if you run the migration multiple times. The script uses `ADD COLUMN IF NOT EXISTS` which is safe to re-run.

## Next Steps After Migration

1. ✅ Restart your application server
2. ✅ Test creating/updating works with the new fields
3. ✅ Test chapter scheduling features
4. ✅ Test user status filtering

## Rollback (if needed)

To rollback the migration, you would need to drop the added columns:

```sql
-- Remove from novels
ALTER TABLE novels
  DROP COLUMN full_download,
  DROP COLUMN goodreads_url,
  DROP COLUMN amazon_url,
  DROP COLUMN spotify_url,
  DROP COLUMN rating,
  DROP COLUMN length,
  DROP COLUMN short_description;

-- Repeat for poems, short_stories, audiobooks...
-- See SCHEMA_REVIEW_REPORT.md for complete list
```

**Note:** Only rollback if absolutely necessary, as application code expects these columns.

---

**Created:** 2026-01-11
**Migration File:** `src/server/migration_add_missing_columns.sql`
**Priority:** HIGH - Required for application stability
