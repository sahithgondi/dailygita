const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Paths
const sqlFilePath = path.join(__dirname, '../app/database/dailygita.sql');
const dbFilePath = path.join(__dirname, '../app/database/dailygita.db');

// Function to check if file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

// Main function
const createDatabase = async () => {
  // First, check if the SQL file exists
  if (!fileExists(sqlFilePath)) {
    console.error('❌ SQL file not found. Generate it first using: npm run generate-db');
    process.exit(1);
  }

  // If the database file already exists, backup it
  if (fileExists(dbFilePath)) {
    const backupPath = `${dbFilePath}.backup`;
    console.log(`🔄 Backing up existing database to ${backupPath}`);
    fs.copyFileSync(dbFilePath, backupPath);
  }

  // Create the database using sqlite3 CLI
  console.log('🔨 Creating SQLite database from SQL file...');
  
  const command = `sqlite3 "${dbFilePath}" < "${sqlFilePath}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error creating database: ${error.message}`);
      console.log('Make sure you have sqlite3 CLI installed. You can install it with:');
      console.log('  macOS: brew install sqlite3');
      console.log('  Linux: apt-get install sqlite3');
      console.log('  Windows: Download from https://www.sqlite.org/download.html');
      return;
    }
    
    if (stderr) {
      console.error(`⚠️ Command stderr: ${stderr}`);
    }
    
    console.log('✅ Database created successfully!');
    
    // Verify the database
    console.log('🔍 Verifying database...');
    
    const verifyCommand = `sqlite3 "${dbFilePath}" "SELECT COUNT(*) FROM shlokas;"`;
    
    exec(verifyCommand, (verifyError, verifyStdout, verifyStderr) => {
      if (verifyError) {
        console.error(`❌ Error verifying database: ${verifyError.message}`);
        return;
      }
      
      const count = parseInt(verifyStdout.trim(), 10);
      console.log(`✅ Database contains ${count} shlokas.`);
      console.log('🎉 Database setup complete!');
    });
  });
};

// Run the function
createDatabase(); 