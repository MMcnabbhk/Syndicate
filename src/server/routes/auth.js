import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Trigger Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }), // You might want a better failure page
    (req, res) => {
        // Successful authentication
        // Redirect to home page or dashboard - frontend should handle the state update via /auth/me or session cookie
        res.redirect('http://localhost:5173/'); // Redirect to frontend
    }
);

// Microsoft OAuth
router.get('/microsoft', passport.authenticate('microsoft', {
    // scope: ['user.read'] // Defined in strategy
}));

router.get('/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login-failed' }),
    (req, res) => {
        res.redirect('http://localhost:5173/');
    }
);

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
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
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
                // Return success anyway, just without authorId (though this is the issue we're fixing, better to not block login)
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
                ...req.user,
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
