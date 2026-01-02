
import db from './src/server/db.js';

async function createTables() {
    try {
        console.log('Creating subscriptions table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                work_id VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                current_period_end DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user (user_id),
                INDEX idx_work (work_id)
            )
        `);

        console.log('Creating contributions table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS contributions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                work_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                currency VARCHAR(10) DEFAULT 'USD',
                type VARCHAR(50) DEFAULT 'subscription',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user (user_id),
                INDEX idx_work (work_id)
            )
        `);

        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        process.exit();
    }
}

createTables();
