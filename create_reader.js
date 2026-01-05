
import db from './src/server/db.js';
import User from './src/server/models/User.js';

async function createReader() {
    try {
        const email = 'reader@syndicate.com';
        const password = 'password';

        console.log(`Checking if ${email} exists...`);
        const existing = await User.findByEmail(email);

        if (existing) {
            console.log('User already exists:', existing.toPublic());
            // Optionally update password if needed, but for now just return
            process.exit(0);
        }

        console.log('Creating new reader user...');
        const user = await User.create({
            email,
            password,
            name: 'Dev Reader',
            role: 'reader'
        });

        console.log('User created successfully:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('ID:', user.id);

        process.exit(0);
    } catch (error) {
        console.error('Failed to create user:', error);
        process.exit(1);
    }
}

createReader();
