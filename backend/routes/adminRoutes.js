import express from 'express';
import { getAdminStats, getActivityLogs } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/logs', getActivityLogs);

export default router;
