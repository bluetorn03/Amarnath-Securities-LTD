import { Router } from 'express';
import { checkConnection } from '../config/db.js';
import authRoutes from './authRoutes.js';
import contentRoutes from './contentRoutes.js';
import documentRoutes from './documentRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import auditRoutes from './auditRoutes.js';
import systemRoutes from './systemRoutes.js';
import userRoutes from './userRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  const result = await checkConnection();
  res.json({
    status: result.ok ? 'healthy' : 'degraded',
    service: 'Amarnath Securities API',
    database: result.ok ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/documents', documentRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/audit', auditRoutes);
router.use('/system', systemRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

