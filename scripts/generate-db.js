// Import the necessary modules
const fs = require('fs');
const path = require('path');

// Function to escape single quotes in text for SQL
const escapeSQL = (text) => {
  if (text === null || text === undefined) return "NULL";
  return `'${text.toString().replace(/'/g, "''")}'`;
};

// Main function to generate SQL
const generateSQL = () => {
  // Adjust the path to correctly point to the shlokas file from the scripts directory
  const shlokasPath = path.join(__dirname, '../app/database/shlokas.js');

  // Load the shlokas module and handle both CommonJS and ES modules
  let shlokas;
  try {
    // Try to load as CommonJS
    const shlokaModule = require(shlokasPath);
    shlokas = shlokaModule.shlokas;
  } catch (error) {
    console.error("Error loading shlokas module:", error);
    process.exit(1);
  }

  const output = [];

  output.push("-- Create shlokas table");
  output.push(`CREATE TABLE IF NOT EXISTS shlokas (
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
  );`);

  output.push("-- Create indices");
  output.push(`CREATE INDEX IF NOT EXISTS idx_shlokas_chapter_id ON shlokas(chapter_id);`);
  output.push(`CREATE INDEX IF NOT EXISTS idx_shlokas_starred ON shlokas(starred);`);
  output.push(`CREATE INDEX IF NOT EXISTS idx_shlokas_noti_id ON shlokas(noti_id);`);

  output.push("-- Begin transaction");
  output.push("BEGIN TRANSACTION;");

  shlokas.forEach((s) => {
    const values = [
      s.chapter_id,
      s.id,
      (s.uvaca || "").replace(/'/g, "''"),
      (s.shloka || "").replace(/'/g, "''"),
      (s.uvaca_meaning || "").replace(/'/g, "''"),
      (s.shloka_meaning || "").replace(/'/g, "''"),
      s.noti_id || "",
      s.starred || 0,
      (s.note || "").replace(/'/g, "''")
    ];
    output.push(
      `INSERT INTO shlokas (chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id, starred, note) VALUES (
        '${values[0]}', ${values[1]}, '${values[2]}', '${values[3]}', '${values[4]}', '${values[5]}', '${values[6]}', ${values[7]}, '${values[8]}'
      );`
    );
  });

  output.push("COMMIT;");

  // Save file into app/database/dailygita.sql
  const outputPath = path.join(__dirname, '../app/database/dailygita.sql');
  fs.writeFileSync(outputPath, output.join("\n"), "utf-8");

  console.log(`✅ SQL file generated at: ${outputPath}`);
};

// Execute the function
generateSQL(); 