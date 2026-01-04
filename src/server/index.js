// src/server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import syndicationRouter from './routes/syndication.js';
import uploadRouter from './routes/uploads.js';
import billingRouter from './routes/billing.js';
import communityRouter from './routes/community.js';
import contactsRouter from './routes/contacts.js';
import invitesRouter from './routes/invites.js';
import notificationsRouter from './routes/notifications.js';
import paymentsRouter from './routes/payments.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Anti-scraping protection - block AI crawlers
import blockAICrawlers from './middleware/antiScraping.js';
app.use(blockAICrawlers);

// Mount billing specifically before global json parser to handle raw webhooks if needed
// or just ensure ordering is correct for the internal express.raw call
app.use('/api/billing', billingRouter);

app.use(express.json());

// Session setup
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import passport from './config/passport.js'; // Import configured passport
import authRouter from './routes/auth.js';
import User from './models/User.js'; // To init table

// Ensure Users table exists
// Ensure Users table exists
// User.createTableIfNotExists().catch(console.error);

const MySQLSessionStore = MySQLStore(session);
const sessionStore = new MySQLSessionStore({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME || 'serialized_novels',
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

app.use(session({
    key: 'syndicate_session_cookie',
    secret: process.env.SESSION_SECRET || 'keyboard_cat_secret_replace_this',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api', apiRouter);
app.use('/api/syndication', syndicationRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/invites', invitesRouter);
app.use('/api/community', communityRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/payments', paymentsRouter);

// Serve static files from the public directory
app.use(express.static('public'));

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
