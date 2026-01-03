import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

if (process.env.GOOGLE_CLIENT_ID) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findByGoogleId(profile.id);

            if (user) {
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                return done(null, user);
            }

            user = await User.create({
                oauthId: profile.id,
                oauthProvider: 'google',
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                name: profile.displayName,
                avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                role: 'reader'
            });

            // Attach tokens for contact import if needed
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;

            done(null, user);
        } catch (err) {
            console.error("Error in Google Strategy:", err);
            done(err, null);
        }
    }));
}

// Microsoft Strategy
if (process.env.MICROSOFT_CLIENT_ID) {
    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: '/api/auth/microsoft/callback',
        scope: ['user.read']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findByMicrosoftId(profile.id);
            if (user) {
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                return done(null, user);
            }

            user = await User.create({
                oauthId: profile.id,
                oauthProvider: 'microsoft',
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                name: profile.displayName,
                avatarUrl: null,
                role: 'reader'
            });
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            done(null, user);
        } catch (err) {
            console.error("Error in Microsoft Strategy:", err);
            done(err, null);
        }
    }));
}

// Apple Strategy
if (process.env.APPLE_CLIENT_ID) {
    passport.use(new AppleStrategy({
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH || '', // Path to .p8 file
        callbackURL: '/api/auth/apple/callback',
        passReqToCallback: false
    }, async (accessToken, refreshToken, idToken, profile, done) => {
        try {
            let user = await User.findByAppleId(idToken.sub); // idToken.sub is the unique user ID
            if (user) return done(null, user);

            const email = profile && profile.email ? profile.email : null; // May differ based on relay service
            const name = profile && profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : 'Apple User';

            user = await User.create({
                oauthId: idToken.sub,
                oauthProvider: 'apple',
                email: email,
                name: name,
                avatarUrl: null,
                role: 'reader'
            });
            done(null, user);
        } catch (err) {
            console.error("Error in Apple Strategy:", err);
            done(err, null);
        }
    }));
}

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Invalid email or password.' });
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

export default passport;
