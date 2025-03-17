import * as SQLite from 'expo-sqlite';
import { shlokas } from './shlokas';
import { createShlokaTableSQL, DB_VERSION, getCurrentVersion, setVersion } from './schema';
import * as helpers from './helpers';

let db;

export const initializeDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync("gita.db");
  helpers.setDBInstance(db);
  return db;
};

export const setupDatabase = async () => {
  await initializeDB();
  await db.execAsync(createShlokaTableSQL);

  const version = await getCurrentVersion(db);
  if (version < DB_VERSION) {
    const result = await db.getAllAsync("SELECT COUNT(*) AS count FROM shlokas");
    if (result[0].count === 0) {
      for (const { chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id } of shlokas) {
        await db.runAsync(
          "INSERT INTO shlokas (chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [chapter_id, id, uvaca || null, shloka, uvaca_meaning || null, shloka_meaning || null, noti_id || null, 0, ""]
        );
      }
    }
    await setVersion(db, DB_VERSION);
  }
};

export { db };
export * from './helpers';
