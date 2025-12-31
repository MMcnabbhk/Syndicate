#!/bin/bash
# MySQL Repair and Setup Script

echo "🔧 MySQL Repair and Database Setup"
echo "===================================="
echo ""

# Stop any running MySQL processes
echo "1️⃣  Stopping MySQL..."
brew services stop mysql 2>/dev/null
killall mysqld 2>/dev/null
sleep 2

# Backup existing data directory
echo "2️⃣  Backing up existing MySQL data..."
if [ -d "/usr/local/var/mysql" ]; then
    mv /usr/local/var/mysql "/usr/local/var/mysql.backup.$(date +%Y%m%d_%H%M%S)"
    echo "   ✅ Backup created"
fi

# Reinitialize MySQL data directory
echo "3️⃣  Reinitializing MySQL data directory..."
mysqld --initialize-insecure --user=$(whoami) --datadir=/usr/local/var/mysql

# Start MySQL
echo "4️⃣  Starting MySQL..."
brew services start mysql
sleep 5

# Wait for MySQL to be ready
echo "5️⃣  Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysql -u root -e "SELECT 1" >/dev/null 2>&1; then
        echo "   ✅ MySQL is ready!"
        break
    fi
    echo "   ⏳ Waiting... ($i/30)"
    sleep 1
done

# Test connection
if ! mysql -u root -e "SELECT 1" >/dev/null 2>&1; then
    echo "❌ MySQL failed to start properly"
    echo "📝 Check the error log:"
    echo "   tail -50 /usr/local/var/mysql/*.err"
    exit 1
fi

# Create the database
echo "6️⃣  Creating book_site database..."
if mysql -u root < schema.sql 2>&1; then
    echo "   ✅ Database created successfully!"
else
    echo "   ❌ Failed to create database"
    exit 1
fi

# Show tables
echo ""
echo "📊 Database tables:"
mysql -u root -e "USE book_site; SHOW TABLES;"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Your MySQL root user has no password."
echo "   To set a password, run:"
echo "   mysql -u root -e \"ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';\""
