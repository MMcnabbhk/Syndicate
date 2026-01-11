#!/bin/bash
# Quick Start Script for Syndicate Application
# Run this on your LOCAL machine after cloning the repo

set -e

echo "🚀 Syndicate Application - Quick Start"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18+ first."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi
echo "✅ npm $(npm --version) found"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found. Please install MySQL first."
    echo "   Mac: brew install mysql"
    echo "   Windows: Download from https://dev.mysql.com/downloads/installer/"
    echo "   Linux: sudo apt-get install mysql-server"
    exit 1
fi
echo "✅ MySQL found"

# Check if MySQL is running
if ! mysql -u root -e "SELECT 1" &> /dev/null; then
    echo "⚠️  MySQL is not running or requires password"
    echo "   Start MySQL and try again."
    echo "   Mac: brew services start mysql"
    echo "   Windows: net start MySQL80"
    echo "   Linux: sudo systemctl start mysql"
    exit 1
fi
echo "✅ MySQL is running"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup database
echo ""
echo "💾 Setting up database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS serialized_novels;" 2>/dev/null || true
echo "✅ Database 'serialized_novels' created"

# Load schema
echo ""
echo "📋 Loading database schema..."
if [ -f "database_dump.sql" ]; then
    mysql -u root serialized_novels < database_dump.sql
    echo "✅ Database schema loaded"
else
    echo "⚠️  database_dump.sql not found, skipping..."
fi

# Apply migrations
echo ""
echo "🔄 Applying migrations..."
if [ -f "src/server/migration_add_missing_columns_fixed.sql" ]; then
    mysql -u root serialized_novels < src/server/migration_add_missing_columns_fixed.sql 2>/dev/null || true
    echo "✅ Migrations applied"
else
    echo "⚠️  Migration file not found, skipping..."
fi

# Verify database
echo ""
echo "🔍 Verifying database setup..."
TABLE_COUNT=$(mysql -u root serialized_novels -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='serialized_novels';")
echo "✅ Database has $TABLE_COUNT tables"

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    npm run server"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    npm run dev"
echo ""
echo "Then open: http://localhost:5173/"
echo ""
echo "Or run both in background:"
echo "  npm run server > backend.log 2>&1 &"
echo "  npm run dev > frontend.log 2>&1 &"
echo ""
