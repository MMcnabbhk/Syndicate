
import db from './src/server/db.js';

async function checkSubscriptionsSchema() {
    try {
        const { rows } = await db.query("DESCRIBE subscriptions");
        console.log("Subscriptions Schema:", JSON.stringify(rows, null, 2));

        const { rows: subData } = await db.query("SELECT * FROM subscriptions LIMIT 5");
        console.log("Subscriptions Data Sample:", JSON.stringify(subData, null, 2));

        const { rows: userData } = await db.query("DESCRIBE users");
        console.log("Users Schema:", JSON.stringify(userData, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSubscriptionsSchema();
