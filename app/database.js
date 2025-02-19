import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("gita.db");

// Initialize Database
export const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS shlokas (
        chapter_id TEXT,
        id INTEGER,
        shloka TEXT,
        shloka_meaning TEXT,
        noti_id TEXT
      );`,
      [],
      () => console.log("✅ Database initialized"),
      (_, error) => console.log("❌ Error initializing database", error)
    );
  });
};

// Insert Sample Data (Call this once to populate the database)
export const insertShloka = (chapter_id, id, shloka, shloka_meaning, noti_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO shlokas (chapter_id, id, shloka, shloka_meaning, noti_id) VALUES (?, ?, ?, ?, ?);`,
      [chapter_id, id, shloka, shloka_meaning, noti_id],
      () => console.log("✅ Shloka inserted"),
      (_, error) => console.log("❌ Error inserting shloka", error)
    );
  });
};

// Fetch a Random Daily Notification Shloka
export const getRandomShloka = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM shlokas ORDER BY RANDOM() LIMIT 1;`,
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log("❌ Error fetching random shloka", error)
    );
  });
};

export default db;
