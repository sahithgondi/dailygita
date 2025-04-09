import * as SQLite from 'expo-sqlite';
import { shlokas } from './shlokas';
import { createShlokaTableSQL, createIndicesSQL, DB_VERSION, getCurrentVersion, setVersion } from './schema';
import * as helpers from './helpers';

let db;

export const initializeDB = async () => {
  if (!db) {
    console.log("🔵 Opening database...");
    db = await SQLite.openDatabaseAsync("gita.db");
    helpers.setDBInstance(db);
  }
  return db;
};

export const setupDatabase = async () => {
  await initializeDB();
  
  try {
    // Check current version
    const currentVersion = await getCurrentVersion(db);
    console.log(`🔵 Current DB version: ${currentVersion}, Latest version: ${DB_VERSION}`);
    
    // Only recreate if versions don't match
    if (currentVersion < DB_VERSION) {
      console.log("🟡 Database needs upgrade. Setting up new schema...");
      
      // Drop table if exists - no transaction yet
      await db.execAsync("DROP TABLE IF EXISTS shlokas");
      
      // Create table with new schema - still no transaction
      await db.execAsync(createShlokaTableSQL);
      
      // Create indices separately - one at a time
      console.log("🔵 Creating indices...");
      for (const indexSQL of createIndicesSQL) {
        await db.execAsync(indexSQL);
      }
      
      console.log("⬇️ Inserting shlokas...");
      
      // Now we can safely start a transaction for insertions
      await db.execAsync("BEGIN TRANSACTION");
      
      try {
        // Insert all shlokas inside transaction
        for (const { chapter_id, id, shloka, shloka_meaning, noti_id } of shlokas) {
          await db.runAsync(
            "INSERT INTO shlokas (chapter_id, id, shloka, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [chapter_id, id, shloka, shloka_meaning || null, noti_id || null, 0, ""]
          );
        }
        
        // Commit the transaction for insertions
        await db.execAsync("COMMIT");
        console.log("✅ Data inserted successfully");
        
        // Update version - outside transaction
        await setVersion(db, DB_VERSION);
        console.log("✅ Database setup complete!");
      } catch (innerError) {
        // Only try to rollback if we're in a transaction
        await db.execAsync("ROLLBACK");
        console.error("❌ Error inserting data:", innerError);
        throw innerError;
      }
    } else {
      console.log("✅ Database is up to date!");
    }
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
};

export { db };
export * from './helpers';
