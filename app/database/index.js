import * as SQLite from 'expo-sqlite';
import { shlokas } from './shlokas';
import { createShlokaTableSQL, DB_VERSION, getCurrentVersion, setVersion } from './schema';
import * as helpers from './helpers';

let db;
const RESET_DB_ON_START = __DEV__;

export const initializeDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync("gita.db");
  helpers.setDBInstance(db);
  return db;
};

export const setupDatabase = async () => {
  await initializeDB();

  if (RESET_DB_ON_START) {
    await db.execAsync("DROP TABLE IF EXISTS shlokas;");
  }

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
