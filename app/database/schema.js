export const DB_VERSION = 17;

// Table creation SQL without indices
export const createShlokaTableSQL = `
  CREATE TABLE IF NOT EXISTS shlokas (
    chapter_id TEXT,
    id INTEGER,
    shloka TEXT, 
    shloka_meaning TEXT,
    noti_id TEXT,
    starred BOOLEAN DEFAULT 0,
    note TEXT DEFAULT '',
    PRIMARY KEY (chapter_id, id)
  );
`;

// Separate SQL statements for creating indices
export const createIndicesSQL = [
  "CREATE INDEX IF NOT EXISTS idx_shlokas_chapter_id ON shlokas(chapter_id);",
  "CREATE INDEX IF NOT EXISTS idx_shlokas_starred ON shlokas(starred);",
  "CREATE INDEX IF NOT EXISTS idx_shlokas_noti_id ON shlokas(noti_id);"
];

export const getCurrentVersion = async (db) => {
  const result = await db.getAllAsync("PRAGMA user_version");
  
  return result[0].user_version || 0;
};

export const setVersion = async (db, version) => {
  await db.execAsync("PRAGMA user_version = " + version);
};

export const migrations = [
  async (db) => {
    // Add a new shloka or update existing ones without dropping the table
    await db.runAsync(
      "INSERT OR REPLACE INTO shlokas (chapter_id, id, shloka, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ["2", 1, "New shloka text", "New meaning", "newId", 0, ""]
    );
  }
];
