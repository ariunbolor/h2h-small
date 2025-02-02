import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

router.get('/stats', authenticateToken, isAdmin, (req, res) => {
  const stats = {
    total: db.prepare('SELECT COUNT(*) as count FROM parcels').get().count,
    pending: db.prepare("SELECT COUNT(*) as count FROM parcels WHERE status = 'pending'").get().count,
    delivered: db.prepare("SELECT COUNT(*) as count FROM parcels WHERE status = 'delivered'").get().count
  };

  res.json(stats);
});

router.get('/drivers', authenticateToken, isAdmin, (req, res) => {
  const drivers = db.prepare(`
    SELECT id, username, full_name, phone, vehicle_number 
    FROM users WHERE role = 'driver'
  `).all();

  res.json(drivers);
});

router.post('/assign-driver', authenticateToken, isAdmin, (req, res) => {
  const { parcel_id, driver_id } = req.body;
  
  db.prepare(`
    UPDATE parcels 
    SET assigned_driver_id = ?, status = 'assigned' 
    WHERE id = ?
  `).run(driver_id, parcel_id);

  res.json({ success: true });
});

export default router;
