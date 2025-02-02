import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';

const router = express.Router();
const JWT_SECRET = 'your-secret-key';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, role: user.role });
});

router.post('/register', (req, res) => {
  const { 
    username, 
    password, 
    role, 
    full_name, 
    phone, 
    vehicle_number, 
    license_number 
  } = req.body;

  if (!['customer', 'driver'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (
        username, password, role, full_name, 
        phone, vehicle_number, license_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      username, hashedPassword, role, full_name, 
      phone, vehicle_number, license_number
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

export default router;
