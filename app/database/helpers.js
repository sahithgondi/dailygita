// 🛠 helpers.js (Clean version)

let db;

export const setDBInstance = (dbInstance) => {
  db = dbInstance;
};

export const getShlokasByChapter = async (chapterId) => {
  if (!db) return [];
  try {
    return await db.getAllAsync("SELECT * FROM shlokas WHERE chapter_id = ?", [chapterId]);
  } catch (error) {
    console.log("❌ Error fetching shlokas:", error);
    return [];
  }
};

export const getRandomShloka = async () => {
  if (!db) return null;
  try {
    const result = await db.getAllAsync(
      "SELECT * FROM shlokas WHERE noti_id IS NOT NULL ORDER BY RANDOM() LIMIT 1;"
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    return null;
  }
};

export const toggleBookmark = async (id, currentStatus) => {
  if (!db) return;
  const newStatus = currentStatus ? 0 : 1;
  try {
    await db.runAsync("UPDATE shlokas SET starred = ? WHERE id = ?", [newStatus, id]);
  } catch (error) {
    console.log("❌ Bookmark error:", error);
  }
};

export const addNote = async (id, note = "") => {
  if (!db) return;
  try {
    await db.runAsync("UPDATE shlokas SET note = ? WHERE id = ?", [note, id]);
  } catch (error) {
    console.log("❌ Note error:", error);
  }
};

export const getBookmarkedShlokas = async () => {
  if (!db) return [];
  try {
    return await db.getAllAsync("SELECT * FROM shlokas WHERE starred = 1");
  } catch (error) {
    return [];
  }
};
