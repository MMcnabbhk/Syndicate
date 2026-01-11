-- Migration to add missing columns identified during schema review
-- Fixed for MySQL 8.0 (without IF NOT EXISTS on ALTER TABLE ADD COLUMN)

-- ============================================================================
-- NOVELS TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE novels
  ADD COLUMN full_download BOOLEAN DEFAULT FALSE,
  ADD COLUMN goodreads_url VARCHAR(2048),
  ADD COLUMN amazon_url VARCHAR(2048),
  ADD COLUMN spotify_url VARCHAR(2048),
  ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00,
  ADD COLUMN length VARCHAR(100),
  ADD COLUMN short_description TEXT;

-- ============================================================================
-- POEMS TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE poems
  ADD COLUMN full_download BOOLEAN DEFAULT FALSE,
  ADD COLUMN goodreads_url VARCHAR(2048),
  ADD COLUMN amazon_url VARCHAR(2048),
  ADD COLUMN spotify_url VARCHAR(2048),
  ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00,
  ADD COLUMN length VARCHAR(100),
  ADD COLUMN short_description TEXT;

-- ============================================================================
-- SHORT_STORIES TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE short_stories
  ADD COLUMN full_download BOOLEAN DEFAULT FALSE,
  ADD COLUMN goodreads_url VARCHAR(2048),
  ADD COLUMN amazon_url VARCHAR(2048),
  ADD COLUMN spotify_url VARCHAR(2048),
  ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00,
  ADD COLUMN length VARCHAR(100),
  ADD COLUMN short_description TEXT;

-- ============================================================================
-- AUDIOBOOKS TABLE - Add missing metadata columns
-- ============================================================================
ALTER TABLE audiobooks
  ADD COLUMN full_download BOOLEAN DEFAULT FALSE,
  ADD COLUMN goodreads_url VARCHAR(2048),
  ADD COLUMN amazon_url VARCHAR(2048),
  ADD COLUMN spotify_url VARCHAR(2048),
  ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00,
  ADD COLUMN length VARCHAR(100),
  ADD COLUMN short_description TEXT;

-- ============================================================================
-- CHAPTERS TABLE - Add missing columns for release scheduling and external links
-- ============================================================================
ALTER TABLE chapters
  ADD COLUMN release_day INT DEFAULT 0 COMMENT 'Day offset for scheduled release to subscribers',
  ADD COLUMN external_url VARCHAR(2048) COMMENT 'External URL for chapter content if hosted elsewhere';

-- Add index for efficient queries on release_day
CREATE INDEX idx_chapters_release_day ON chapters(release_day);

-- ============================================================================
-- USERS TABLE - Add status column for account state management
-- ============================================================================
ALTER TABLE users
  ADD COLUMN status VARCHAR(50) DEFAULT 'active' COMMENT 'User account status: active, suspended, deleted';

-- Add index for efficient status filtering
CREATE INDEX idx_users_status ON users(status);
