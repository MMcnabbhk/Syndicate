ALTER TABLE chapters ADD CONSTRAINT unique_chapter_sequence UNIQUE (novel_id, chapter_number);
