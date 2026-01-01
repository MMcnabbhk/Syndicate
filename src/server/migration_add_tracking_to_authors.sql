-- Add tracking columns to authors table
ALTER TABLE authors ADD COLUMN IF NOT EXISTS meta_pixel_id VARCHAR(50);
ALTER TABLE authors ADD COLUMN IF NOT EXISTS ga_measurement_id VARCHAR(50);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_authors_meta_pixel ON authors(meta_pixel_id);
CREATE INDEX IF NOT EXISTS idx_authors_ga_measurement ON authors(ga_measurement_id);
