import express from 'express';
import { createNotification, getNotifications } from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Get notifications (students get targeted, admins get all)
router.get('/', getNotifications);

// Create notification (Admin only)
router.post('/', authorize('admin'), createNotification);

export default router;
