import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALGORITHM = 'aes-256-gcm';
const SECRET = process.env.ENCRYPTION_SECRET || 'v7x!A%C*F-JaNdRfUjXn2r5u8x/A?D(G'; // 32 bytes
const IV_LENGTH = 16;

/**
 * Encrypts text using AES-256-GCM.
 */
export function encrypt(text) {
    if (!text) return null;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts text using AES-256-GCM.
 */
export function decrypt(encryptedData) {
    if (!encryptedData) return null;
    try {
        const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET), iv);

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (e) {
        console.error("Decryption failed:", e);
        return null;
    }
}
