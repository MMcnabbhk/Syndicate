#!/bin/bash
# MySQL Database Setup Script for Book Site

echo "🔍 Checking MySQL status..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Starting MySQL..."
    brew services start mysql
    echo "⏳ Waiting for MySQL to start..."
    sleep 5
fi

echo "🔌 Testing MySQL connection..."
if mysql -u root -h 127.0.0.1 -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ MySQL is running and accessible"
else
    echo "⚠️  MySQL is running but not accepting connections yet"
    echo "📝 Please run these commands manually in your terminal:"
    echo ""
    echo "1. Check MySQL status:"
    echo "   brew services list | grep mysql"
    echo ""
    echo "2. If needed, restart MySQL:"
    echo "   brew services restart mysql"
    echo ""
    echo "3. Wait 10 seconds, then create the database:"
    echo "   mysql -u root < schema.sql"
    echo ""
    echo "4. Verify the database was created:"
    echo "   mysql -u root -e 'SHOW DATABASES;'"
    exit 1
fi

echo "🗄️  Creating database and tables..."
if mysql -u root < schema.sql 2>&1; then
    echo "✅ Database 'book_site' created successfully!"
else
    echo "❌ Failed to create database. Error above."
    exit 1
fi

echo ""
echo "🎉 Setup complete! Database 'book_site' is ready."
echo ""
echo "📊 To verify, run:"
echo "   mysql -u root -e 'USE book_site; SHOW TABLES;'"
