// 🗃️ app/database/index.js - Final Version with Force Insert

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

  console.log("🟡 setupDatabase(): Dropping old table to apply new schema...");
  await db.execAsync("DROP TABLE IF EXISTS shlokas");

  console.log("🟡 Creating table with new schema...");
  await db.execAsync(createShlokaTableSQL);

  console.log("⬇️ Reinserting all shlokas in transaction...");
  await db.execAsync("BEGIN TRANSACTION");

  try {
    for (const { chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id } of shlokas) {
      await db.runAsync(
        "INSERT INTO shlokas (chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [chapter_id, id, uvaca || null, shloka, uvaca_meaning || null, shloka_meaning || null, noti_id || null, 0, ""]
      );
    }

    await db.execAsync("COMMIT");
    console.log("✅ Shlokas inserted successfully");
  } catch (error) {
    await db.execAsync("ROLLBACK");
    console.log("❌ Transaction failed, rollback done.", error);
  }

  await setVersion(db, DB_VERSION);
};


export { db };
export * from './helpers';
