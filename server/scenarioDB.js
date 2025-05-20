const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './database/scenarioDB.db');
const db = new sqlite3.Database(dbPath);

// Create table if not exists

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scenario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      author TEXT,
      tags TEXT,
      upvotes INTEGER,
      downvotes INTEGER,
      imageUrl TEXT,
      status TEXT,
      createdAt TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id INTEGER,
      author TEXT,
      comment TEXT,
      timestamp TEXT,
      FOREIGN KEY(scenario_id) REFERENCES scenario(id)
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS contact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      submittedAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      name TEXT PRIMARY KEY,
      color TEXT NOT NULL
    );
  `);
  
  
});
    
module.exports = db;
