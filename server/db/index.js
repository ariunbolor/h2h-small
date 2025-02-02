import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('parcels.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    full_name TEXT,
    phone TEXT,
    vehicle_number TEXT,
    license_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parcels (
    id TEXT PRIMARY KEY,
    sender TEXT,
    recipient TEXT,
    status TEXT,
    location TEXT,
    assigned_driver_id INTEGER,
    pickup_address TEXT,
    delivery_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(assigned_driver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS driver_locations (
    driver_id INTEGER PRIMARY KEY,
    latitude TEXT,
    longitude TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(driver_id) REFERENCES users(id)
  );
`);

// Create default admin
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminUser) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
    .run('admin', hashedPassword, 'admin', 'Admin User');
}

export default db;
