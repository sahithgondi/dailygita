const SQLite = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Get the path to the shlokas.js file
const shlokasPath = path.join(__dirname, '../app/database/shlokas.js');
const dbPath = path.join(__dirname, '../app/database/dailygita.db');

// Function to create the database
async function createDatabase() {
  console.log('Creating SQLite database...');

  // Delete existing database if it exists
  if (fs.existsSync(dbPath)) {
    console.log('Removing existing database...');
    fs.unlinkSync(dbPath);
  }

  // Create a new database
  const db = new SQLite.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
    console.log('Connected to the SQLite database.');
  });

  // Create the table
  db.serialize(() => {
    console.log('Creating shlokas table...');
    
    db.run(`CREATE TABLE IF NOT EXISTS shlokas (
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
    )`);
    
    // Create indices
    db.run('CREATE INDEX IF NOT EXISTS idx_shlokas_chapter_id ON shlokas(chapter_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_shlokas_starred ON shlokas(starred)');
    db.run('CREATE INDEX IF NOT EXISTS idx_shlokas_noti_id ON shlokas(noti_id)');
    
    // Read shlokas from the module
    console.log('Reading shlokas from file...');
    const shlokasModule = require('../app/database/shlokas');
    const shlokas = shlokasModule.shlokas;
    
    console.log(`Found ${shlokas.length} shlokas.`);
    
    // Insert all shlokas
    console.log('Inserting shlokas into database...');
    const stmt = db.prepare(`
      INSERT INTO shlokas (
        chapter_id, id, uvaca, shloka, uvaca_meaning, 
        shloka_meaning, noti_id, starred, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    shlokas.forEach(shloka => {
      stmt.run(
        shloka.chapter_id,
        shloka.id,
        shloka.uvaca || null,
        shloka.shloka || null,
        shloka.uvaca_meaning || null,
        shloka.shloka_meaning || null,
        shloka.noti_id || null,
        shloka.starred ? 1 : 0,
        shloka.note || ''
      );
    });
    
    stmt.finalize();
    
    // Verify database
    db.get('SELECT COUNT(*) as count FROM shlokas', (err, row) => {
      if (err) {
        console.error('Error counting shlokas:', err.message);
      } else {
        console.log(`Database contains ${row.count} shlokas.`);
      }
      
      // Close the database
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database created successfully!');
        }
      });
    });
  });
}

// Run the function
createDatabase(); 