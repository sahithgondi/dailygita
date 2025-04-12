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
      
      try {
        // Check if table exists before dropping
        const tableExists = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='shlokas'");
        console.log("Table check:", tableExists.length > 0 ? "exists" : "doesn't exist");
        
        if (tableExists.length > 0) {
          // Table exists, drop it
          await db.execAsync("DROP TABLE IF EXISTS shlokas");
          console.log("✅ Dropped existing table");
        }
        
        // Create table with new schema - still no transaction
        await db.execAsync(createShlokaTableSQL);
        console.log("✅ Created table");
        
        // Create indices separately - one at a time
        console.log("🔵 Creating indices...");
        for (const indexSQL of createIndicesSQL) {
          await db.execAsync(indexSQL);
        }
        
        console.log("⬇️ Inserting shlokas...");
        
        // Insert in batches to prevent timeout
        const BATCH_SIZE = 50;
        for (let i = 0; i < shlokas.length; i += BATCH_SIZE) {
          console.log(`🔵 Inserting batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(shlokas.length/BATCH_SIZE)}`);
          
          // Start a transaction for this batch
          await db.execAsync("BEGIN TRANSACTION");
          
          try {
            const batch = shlokas.slice(i, i + BATCH_SIZE);
            for (const { chapter_id, id, shloka, shloka_meaning, noti_id } of batch) {
              await db.runAsync(
                "INSERT INTO shlokas (chapter_id, id, shloka, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [chapter_id, id, shloka, shloka_meaning || null, noti_id || null, 0, ""]
              );
            }
            
            // Commit this batch
            await db.execAsync("COMMIT");
          } catch (batchError) {
            await db.execAsync("ROLLBACK");
            console.error(`❌ Error inserting batch ${Math.floor(i/BATCH_SIZE) + 1}:`, batchError);
            throw batchError;
          }
        }
        
        console.log("✅ All data inserted successfully");
        
        // Update version - outside transaction
        await setVersion(db, DB_VERSION);
        console.log("✅ Database setup complete!");
      } catch (setupError) {
        console.error("❌ Database setup steps failed:", setupError);
        throw setupError;
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
