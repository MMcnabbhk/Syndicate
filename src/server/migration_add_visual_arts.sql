CREATE TABLE IF NOT EXISTS visual_arts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    subscribers_count INT DEFAULT 0,
    lifetime_earnings DECIMAL(10, 2) DEFAULT 0,
    genre VARCHAR(100),
    display_order INT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visual_art_folios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visual_art_id INT NOT NULL,
    chapter_number INT NOT NULL, -- Using 'chapter_number' for internal consistency with other folio/chapter models
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    description TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    display_order INT DEFAULT 0,
    FOREIGN KEY (visual_art_id) REFERENCES visual_arts(id) ON DELETE CASCADE
);
