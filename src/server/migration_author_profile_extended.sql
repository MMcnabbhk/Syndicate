-- Migration to add extended profile fields to authors table
ALTER TABLE authors ADD COLUMN IF NOT EXISTS handle VARCHAR(100);
ALTER TABLE authors ADD COLUMN IF NOT EXISTS amazon_url TEXT;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS goodreads_url TEXT;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS profile_images JSON;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS video_introductions JSON;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS auto_responder_contributor TEXT;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS auto_responder_fan TEXT;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS target_gender JSON;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS target_age JSON;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS target_income JSON;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS target_education JSON;

-- Ensure indexes for handle which might be used for lookups
CREATE INDEX IF NOT EXISTS idx_authors_handle ON authors(handle);
