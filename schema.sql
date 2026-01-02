
CREATE DATABASE IF NOT EXISTS serialized_novels;
USE serialized_novels;

CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  user_id VARCHAR(255),
  bio TEXT,
  profile_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS novels (
  id VARCHAR(255) PRIMARY KEY,
  author_id VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  cover_image_url VARCHAR(255),
  status VARCHAR(50),
  price_monthly DECIMAL(10, 2),
  published_at DATETIME,
  subscribers_count INT DEFAULT 0,
  lifetime_earnings DECIMAL(10, 2) DEFAULT 0.00,
  genre VARCHAR(100),
  frequency VARCHAR(50),
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE IF NOT EXISTS chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  novel_id VARCHAR(255),
  title VARCHAR(255),
  chapter_number INT,
  content_html TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id)
);
