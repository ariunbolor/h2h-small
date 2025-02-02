import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import parcelRoutes from './routes/parcels.js';
import driverRoutes from './routes/driver.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
