-- Migration to add missing columns identified during schema review
-- This ensures all columns expected by the application models exist in the database

-- ============================================================================
-- NOVELS TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE novels ADD COLUMN IF NOT EXISTS full_download BOOLEAN DEFAULT FALSE;
ALTER TABLE novels ADD COLUMN IF NOT EXISTS goodreads_url VARCHAR(2048);
ALTER TABLE novels ADD COLUMN IF NOT EXISTS amazon_url VARCHAR(2048);
ALTER TABLE novels ADD COLUMN IF NOT EXISTS spotify_url VARCHAR(2048);
ALTER TABLE novels ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE novels ADD COLUMN IF NOT EXISTS length VARCHAR(100);
ALTER TABLE novels ADD COLUMN IF NOT EXISTS short_description TEXT;

-- ============================================================================
-- POEMS TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE poems ADD COLUMN IF NOT EXISTS full_download BOOLEAN DEFAULT FALSE;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS goodreads_url VARCHAR(2048);
ALTER TABLE poems ADD COLUMN IF NOT EXISTS amazon_url VARCHAR(2048);
ALTER TABLE poems ADD COLUMN IF NOT EXISTS spotify_url VARCHAR(2048);
ALTER TABLE poems ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS length VARCHAR(100);
ALTER TABLE poems ADD COLUMN IF NOT EXISTS short_description TEXT;

-- ============================================================================
-- SHORT_STORIES TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS full_download BOOLEAN DEFAULT FALSE;
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS goodreads_url VARCHAR(2048);
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS amazon_url VARCHAR(2048);
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS spotify_url VARCHAR(2048);
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS length VARCHAR(100);
ALTER TABLE short_stories ADD COLUMN IF NOT EXISTS short_description TEXT;

-- ============================================================================
-- AUDIOBOOKS TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS full_download BOOLEAN DEFAULT FALSE;
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS goodreads_url VARCHAR(2048);
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS amazon_url VARCHAR(2048);
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS spotify_url VARCHAR(2048);
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS length VARCHAR(100);
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS short_description TEXT;

-- ============================================================================
-- CHAPTERS TABLE - Add missing columns for release scheduling and external links
-- ============================================================================
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS release_day INT DEFAULT 0 COMMENT 'Day offset for scheduled release to subscribers';
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS external_url VARCHAR(2048) COMMENT 'External URL for chapter content if hosted elsewhere';

-- Add index for efficient queries on release_day
CREATE INDEX IF NOT EXISTS idx_chapters_release_day ON chapters(release_day);

-- ============================================================================
-- USERS TABLE - Add status column for account state management
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' COMMENT 'User account status: active, suspended, deleted';

-- Add index for efficient status filtering
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ============================================================================
-- Summary of changes:
-- - Added 7 metadata columns to each work type table (novels, poems, short_stories, audiobooks)
-- - Added release_day and external_url to chapters table
-- - Added status column to users table
-- - Added appropriate indexes for performance
-- ============================================================================
