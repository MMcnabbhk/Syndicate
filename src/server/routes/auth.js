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

// Get Current User (for frontend session check)
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: req.user
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
