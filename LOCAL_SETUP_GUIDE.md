# Local Setup Guide for Syndicate Application

## Why Can't I Access localhost:5173?

The application is running inside Claude Code's container environment. To access it in your browser, you need to run it on **your local machine**.

---

## Quick Setup (5 minutes)

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Git

### Step 1: Clone and Checkout
```bash
# Get the repository
git clone <your-repo-url> Syndicate
cd Syndicate

# Switch to the fixed branch
git checkout claude/find-fix-bug-mk9iijg8rpe64s13-5dftL

# Pull latest changes
git pull origin claude/find-fix-bug-mk9iijg8rpe64s13-5dftL
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup MySQL Database

#### Start MySQL
```bash
# Mac (with Homebrew):
brew services start mysql

# Windows (as Administrator):
net start MySQL80

# Linux:
sudo systemctl start mysql
# or
sudo service mysql start
```

#### Create Database
```bash
# Connect to MySQL (press Enter for no password)
mysql -u root -p

# Then run:
CREATE DATABASE serialized_novels;
exit;
```

#### Load Schema and Apply Migrations
```bash
# Load the complete database dump
mysql -u root serialized_novels < database_dump.sql

# Apply the missing columns migration
mysql -u root serialized_novels < src/server/migration_add_missing_columns_fixed.sql
```

### Step 4: Configure Environment
The `.env` file should already have:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=serialized_novels
PORT=4000
```

If your MySQL has a password, update `DB_PASSWORD` in `.env`

### Step 5: Start the Application

**Option A: Two Terminals (Recommended)**
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

**Option B: Background Processes**
```bash
# Start both in background
npm run server > backend.log 2>&1 &
npm run dev > frontend.log 2>&1 &

# Check logs
tail -f backend.log
tail -f frontend.log
```

### Step 6: Access the Application
Open your browser to:
```
http://localhost:5173/
```

Backend API will be at:
```
http://localhost:4000/api
```

---

## Verification Checklist

✅ Node.js installed: `node --version`
✅ MySQL running: `mysql -u root -e "SELECT 1"`
✅ Database created: `mysql -u root -e "SHOW DATABASES;" | grep serialized_novels`
✅ Backend running: `curl http://localhost:4000/`
✅ Frontend running: `curl http://localhost:5173/`

---

## Troubleshooting

### "Command not found: mysql"
**Solution:** Install MySQL
- Mac: `brew install mysql`
- Windows: Download from https://dev.mysql.com/downloads/installer/
- Linux: `sudo apt-get install mysql-server`

### "Connection refused" to MySQL
**Solution:** Start MySQL service (see Step 3)

### "Unknown database 'serialized_novels'"
**Solution:** Create the database:
```bash
mysql -u root -e "CREATE DATABASE serialized_novels;"
```

### Port 5173 already in use
**Solution:** Kill existing process:
```bash
# Find the process
lsof -ti:5173

# Kill it
kill -9 $(lsof -ti:5173)
```

### "Access denied for user 'root'@'localhost'"
**Solution:** Update `.env` with your MySQL password:
```
DB_PASSWORD=your_mysql_password
```

---

## What's Been Fixed

All these fixes are included in this branch:

✅ **Security Fixes:**
- Path traversal vulnerability in image routes
- Promise race conditions in authentication
- XSS vulnerabilities (innerHTML sanitization)

✅ **Performance Fixes:**
- Memory leaks from setTimeout (3 instances)
- Proper cleanup functions added

✅ **Database Updates:**
- 31 missing columns added
- Full schema synchronized with models
- All migrations applied

✅ **Code Quality:**
- Deprecated API handling
- Error logging improvements
- Browser compatibility checks

---

## Need Help?

Check these files for more details:
- `COMPLETION_SUMMARY.md` - Complete list of all fixes
- `SCHEMA_REVIEW_REPORT.md` - Database schema details
- `MIGRATION_INSTRUCTIONS.md` - Migration details

---

**Everything is ready to run!** Just follow the steps above to run on your local machine.
