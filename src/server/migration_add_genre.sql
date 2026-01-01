-- Add genre column to all work tables
ALTER TABLE novels ADD COLUMN genre VARCHAR(100);
ALTER TABLE short_stories ADD COLUMN genre VARCHAR(100);
ALTER TABLE poems ADD COLUMN genre VARCHAR(100);
ALTER TABLE audiobooks ADD COLUMN genre VARCHAR(100);
