
import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Define paths
// public/uploads is where original files are stored
// public/cache is where processed files will be stored
const UPLOADS_DIR = path.resolve(__dirname, '../../../public/uploads');
const CACHE_DIR = path.resolve(__dirname, '../../../public/cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

router.get(/(.*)/, async (req, res) => {
    try {
        // req.params[0] captures the wildcard path (e.g., "covers/image.jpg")
        const relativePath = req.params[0];

        // Query parameters
        const width = req.query.w ? parseInt(req.query.w) : null;
        const quality = req.query.q ? parseInt(req.query.q) : 80;
        const format = req.query.f || 'webp'; // Default to webp

        // Original file path
        const originalPath = path.join(UPLOADS_DIR, relativePath);

        // Check if original exists
        if (!fs.existsSync(originalPath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Validate params
        if (width && (isNaN(width) || width <= 0)) {
            return res.status(400).json({ error: 'Invalid width' });
        }

        // Construct cache key/filename
        // e.g., covers-image-w300-q80.webp
        const safeName = relativePath.split('/').join('-').replace(/\.[^/.]+$/, "");
        const cacheFilename = `${safeName}-w${width || 'orig'}-q${quality}.${format}`;
        const cachePath = path.join(CACHE_DIR, cacheFilename);

        // Serve cached file if exists
        if (fs.existsSync(cachePath)) {
            const stats = fs.statSync(cachePath);
            // Check if cache is newer than original (in case original was replaced)
            const originalStats = fs.statSync(originalPath);

            if (stats.mtime > originalStats.mtime) {
                // Set long cache headers
                res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
                return res.sendFile(cachePath);
            }
        }

        // Process image
        let pipeline = sharp(originalPath);

        if (width) {
            pipeline = pipeline.resize(width);
        }

        if (format === 'webp') {
            pipeline = pipeline.webp({ quality });
        } else if (format === 'jpeg' || format === 'jpg') {
            pipeline = pipeline.jpeg({ quality });
        } else if (format === 'png') {
            pipeline = pipeline.png({ quality });
        }

        await pipeline.toFile(cachePath);

        // Serve the newly created file
        res.set('Cache-Control', 'public, max-age=31536000');
        res.sendFile(cachePath);

    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({ error: 'Image processing failed' });
    }
});

export default router;
