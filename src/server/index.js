// src/server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import syndicationRouter from './routes/syndication.js';
import uploadRouter from './routes/uploads.js';
import billingRouter from './routes/billing.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Mount billing specifically before global json parser to handle raw webhooks if needed
// or just ensure ordering is correct for the internal express.raw call
app.use('/api/billing', billingRouter);

app.use(express.json());
app.use('/api', apiRouter);
app.use('/api/syndication', syndicationRouter);
app.use('/api/uploads', uploadRouter);

// Serve static files from the public directory
app.use(express.static('public'));

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
