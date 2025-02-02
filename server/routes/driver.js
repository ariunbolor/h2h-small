import express from 'express';
import { authenticateToken, isDriver } from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

router.get('/assignments', authenticateToken, isDriver, (req, res) => {
  const parcels = db.prepare(`
    SELECT * FROM parcels 
    WHERE assigned_driver_id = ? 
    AND status != 'delivered'
  `).all(req.user.id);
  
  res.json(parcels);
});

router.post('/location', authenticateToken, isDriver, (req, res) => {
  const { latitude, longitude } = req.body;
  
  db.prepare(`
    INSERT OR REPLACE INTO driver_locations (driver_id, latitude, longitude)
    VALUES (?, ?, ?)
  `).run(req.user.id, latitude, longitude);

  res.json({ success: true });
});

router.put('/parcel/:id', authenticateToken, isDriver, (req, res) => {
  const { id } = req.params;
  const { status, location } = req.body;

  db.prepare(`
    UPDATE parcels 
    SET status = ?, location = ? 
    WHERE id = ? AND assigned_driver_id = ?
  `).run(status, location, id, req.user.id);

  res.json({ success: true });
});

export default router;
