-- Add metrics columns to all work tables
ALTER TABLE novels ADD COLUMN subscribers_count INT DEFAULT 0;
ALTER TABLE novels ADD COLUMN lifetime_earnings DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE short_stories ADD COLUMN subscribers_count INT DEFAULT 0;
ALTER TABLE short_stories ADD COLUMN lifetime_earnings DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE poems ADD COLUMN subscribers_count INT DEFAULT 0;
ALTER TABLE poems ADD COLUMN lifetime_earnings DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE audiobooks ADD COLUMN subscribers_count INT DEFAULT 0;
ALTER TABLE audiobooks ADD COLUMN lifetime_earnings DECIMAL(10,2) DEFAULT 0.00;
