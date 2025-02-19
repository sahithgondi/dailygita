import * as SQLite from "expo-sqlite";

// ✅ Correctly open the database using openDatabaseAsync
let db;

const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync("gita.db");
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
};

// ✅ Ensure the database is set up before running transactions
export const setupDatabase = async () => {
  if (!db) {
    console.error("❌ Database not initialized yet.");
    return;
  }

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS shlokas (
        chapter_id TEXT,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shloka TEXT,
        shloka_meaning TEXT,
        noti_id TEXT
      );`,
      [],
      () => console.log("✅ Table created successfully"),
      (_, error) => console.log("❌ Error creating table:", error)
    );
  });
};

// ✅ Function to get a random shloka
export const getRandomShloka = (callback) => {
  if (!db) {
    console.error("❌ Database is not initialized.");
    return;
  }

  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM shlokas ORDER BY RANDOM() LIMIT 1;`,
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log("❌ Error fetching shloka:", error)
    );
  });
};

// ✅ Initialize the database on import
initializeDatabase();

export default db;
