// src/server/middleware/auth.js
/**
 * Standardized Mock Auth Middleware
 * In a production environment, this would verify JWTs or session cookies.
 */
export const authMiddleware = (req, res, next) => {
    // For now, we simulate a logged-in user with a fixed ID and join date
    req.user = {
        id: 1,
        name: 'Michael Sterling',
        email: 'michael@example.com',
        joinDate: '2025-12-01T00:00:00Z'
    };
    next();
};

export const adminMiddleware = (req, res, next) => {
    // Placeholder for admin-only routes
    if (req.user && req.user.id === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
};
