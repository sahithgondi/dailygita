export const DB_VERSION = ;

export const createShlokaTableSQL = `
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
`;

export const getCurrentVersion = async (db) => {
  const result = await db.getAllAsync("PRAGMA user_version");
  return result[0].user_version || 0;
};

export const setVersion = async (db, version) => {
  await db.execAsync("PRAGMA user_version = " + version);
};
