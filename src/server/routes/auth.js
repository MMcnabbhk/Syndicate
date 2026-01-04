import { Router } from 'express';
import passport from 'passport';
import crypto from 'crypto';
import notify from '../utils/notify.js';

const router = Router();

// Trigger Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Contacts Import
router.get('/google/contacts', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/contacts.readonly'],
    state: 'import_contacts'
}));

// Google OAuth Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        const isImport = req.query.state === 'import_contacts';
        res.redirect(isImport ? 'http://localhost:5173/community?import=google' : 'http://localhost:5173/');
    }
);

// Microsoft OAuth
router.get('/microsoft', passport.authenticate('microsoft'));

// Microsoft Contacts Import
router.get('/microsoft/contacts', passport.authenticate('microsoft', {
    scope: ['user.read', 'Contacts.Read'],
    state: 'import_contacts'
}));

router.get('/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login-failed' }),
    (req, res) => {
        const isImport = req.query.state === 'import_contacts';
        res.redirect(isImport ? 'http://localhost:5173/community?import=microsoft' : 'http://localhost:5173/');
    }
);

// Traditional Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info.message || 'Login failed' });

        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ success: true, user: user.toPublic() });
        });
    })(req, res, next);
});

// Registration
router.post('/register', async (req, res) => {
    const { email, password, display_name, signupCreatorId } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const existing = await User.findByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email already in use' });

        const user = await User.create({ email, password, name: display_name, signupCreatorId });

        // Notify creator if applicable
        if (signupCreatorId) {
            // In a real app we might verify creator existence or fetch their name, but for now just send
            await notify.send(
                signupCreatorId,
                'fan',
                'New Fan',
                `A new reader has signed up via your profile!`
            );
        }

        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to log in after registration' });
            res.status(201).json({ success: true, user: user.toPublic() });
        });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Magic Link Request
router.post('/magic-link', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        let user = await User.findByEmail(email);
        if (!user) {
            // Auto-register for magic link if not exists? User's choice. 
            // For now, let's require an account or auto-create it.
            user = await User.create({ email, name: email.split('@')[0] });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await User.setMagicToken(email, token, expires);

        // In production, send an email. For now, log to console.
        const magicUrl = `http://localhost:5173/verify-magic?token=${token}`;
        console.log(`[MAGIC LINK] Sent to ${email}: ${magicUrl}`);

        res.json({ success: true, message: 'Magic link sent! Check your "inbox" (console in dev).' });
    } catch (err) {
        console.error("Magic Link Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Magic Link Verification
router.get('/verify-magic', async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token missing' });

    try {
        const user = await User.findByMagicToken(token);
        if (!user) return res.status(401).json({ error: 'Invalid or expired magic link' });

        // Clear token after use
        await User.setMagicToken(user.email, null, null);

        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to log in' });
            res.redirect('http://localhost:5173/');
        });
    } catch (err) {
        console.error("Magic Verification Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Apple OAuth
router.get('/apple', passport.authenticate('apple'));

router.post('/apple/callback',
    // Apple sends a POST request for callback
    passport.authenticate('apple', { failureRedirect: '/login-failed' }),
    (req, res) => {
        res.redirect('http://localhost:5173/');
    }
);

import User from '../models/User.js';

// DEV ONLY: Passwordless Login for testing
router.post('/dev-login', async (req, res) => {
    const { email } = req.body;
    console.log(`[Dev Login] Attempting login for ${email}`);

    try {
        let user = await User.findByEmail(email);

        if (!user) {
            console.log(`[Dev Login] User not found, creating new dev user for ${email}`);
            // Auto-create user for dev convenience
            const role = email.toLowerCase().includes('creator') ? 'creator' : 'reader';
            user = await User.create({
                email,
                name: email.split('@')[0],
                role
            });

            // If creator, also ensure Author profile exists
            if (role === 'creator') {
                await Author.create({
                    user_id: user.id,
                    name: user.display_name || 'New Creator',
                    bio: 'Auto-generated bio for dev user.'
                });
            }
        }

        // Manually log in the user via Passport
        req.login(user, (err) => {
            if (err) {
                console.error("Login Error:", err);
                return res.status(500).json({ error: 'Login session failed' });
            }

            // Fetch author ID if creator
            Author.findByUserId(user.id).then(author => {
                console.log(`[Dev Login] Success for user ${user.id}. Author ID: ${author ? author.id : 'None'}`);
                return res.json({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        authorId: author ? author.id : null
                    }
                });
            }).catch(err => {
                console.error("Error fetching author details:", err);
                // Return success anyway, just without authorId
                return res.json({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        authorId: null
                    }
                });
            });
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

import Author from '../models/Author.js';

// Get Current User (for frontend session check)
router.get('/me', async (req, res) => {
    if (req.isAuthenticated()) {
        let authorId = null;
        console.log(`[Auth Debug] Checking session for user: ${req.user.id} (${req.user.email}) - Role: ${req.user.role}`);

        if (req.user.role === 'creator') {
            try {
                const author = await Author.findByUserId(req.user.id);
                console.log(`[Auth Debug] Author lookup result for user ${req.user.id}:`, author ? `Found (ID: ${author.id})` : 'Not Found');
                if (author) {
                    authorId = author.id;
                }
            } catch (e) {
                console.error("[Auth Debug] Error fetching author for user session:", e);
            }
        }

        res.json({
            isAuthenticated: true,
            user: {
                ...req.user.toPublic(),
                authorId
            }
        });
    } else {
        res.json({
            isAuthenticated: false,
            user: null
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return res.status(500).json({ error: 'Logout failed' }); }
        res.json({ message: 'Logged out successfully' });
    });
});

export default router;
