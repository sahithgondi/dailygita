-- Set the database version
PRAGMA user_version = 12;

-- Create the shlokas table
CREATE TABLE IF NOT EXISTS shlokas (
    chapter_id TEXT,
    id INTEGER,
    uvaca TEXT,
    shloka TEXT,
    uvaca_meaning TEXT,
    shloka_meaning TEXT,
    noti_id TEXT,
    starred BOOLEAN DEFAULT 0,
    note TEXT DEFAULT '',
    PRIMARY KEY (chapter_id, id)
);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_shlokas_chapter_id ON shlokas(chapter_id);
CREATE INDEX IF NOT EXISTS idx_shlokas_starred ON shlokas(starred);
CREATE INDEX IF NOT EXISTS idx_shlokas_noti_id ON shlokas(noti_id);

-- Begin transaction for data insertion
BEGIN TRANSACTION;

-- Commit the transaction
COMMIT;