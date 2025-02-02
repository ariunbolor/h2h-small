import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const parcels = db.prepare('SELECT * FROM parcels').all();
  res.json(parcels);
});

router.post('/', authenticateToken, (req, res) => {
  const { sender, recipient, pickup_address, delivery_address } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  const stmt = db.prepare(`
    INSERT INTO parcels (
      id, sender, recipient, status, 
      pickup_address, delivery_address
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(id, sender, recipient, 'pending', pickup_address, delivery_address);
  res.json({ id });
});

router.get('/:id', authenticateToken, (req, res) => {
  const parcel = db.prepare('SELECT * FROM parcels WHERE id = ?').get(req.params.id);
  if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
  res.json(parcel);
});

export default router;
