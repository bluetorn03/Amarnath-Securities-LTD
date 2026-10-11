import { Router } from 'express';
import { recordPageVisit, getPageVisits } from '../controllers/analyticsController.js';

const router = Router();

// Public visit recorder (called by front-end when user views a page)
router.post('/visit', recordPageVisit);

// Public/Admin stats fetcher (live database counts)
router.get('/visits', getPageVisits);

export default router;
