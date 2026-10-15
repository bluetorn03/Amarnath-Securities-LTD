import { Router } from 'express';
import { recordPageVisit, getPageVisits } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public visit recorder (called by front-end when user views a page)
router.post('/visit', recordPageVisit);

// Administrative analytics metrics (requires authentication)
router.get('/visits', authenticate, getPageVisits);

export default router;
