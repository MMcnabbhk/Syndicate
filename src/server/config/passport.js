import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as AppleStrategy } from 'passport-apple';
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
                return done(null, user);
            }

            user = await User.create({
                googleId: profile.id,
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                displayName: profile.displayName,
                avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                role: 'reader' // Default role
            });

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
            if (user) return done(null, user);

            user = await User.create({
                microsoftId: profile.id,
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                displayName: profile.displayName,
                avatarUrl: null, // Microsoft graph photo requires extra fetch
                role: 'reader'
            });
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
                appleId: idToken.sub,
                email: email,
                displayName: name,
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

export default passport;
