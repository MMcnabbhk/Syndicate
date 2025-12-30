// src/server/routes/uploads.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = 'public/uploads/';
        if (file.mimetype.startsWith('image/')) {
            dest += 'covers/';
        } else if (file.mimetype.startsWith('audio/')) {
            dest += 'audio/';
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, MP3, WAV, and MP4 are allowed.'));
        }
    }
});

// Single file upload route
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the relative path for the frontend
    const relativePath = req.file.path.replace('public', '');
    res.json({
        url: relativePath,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
});

export default router;
