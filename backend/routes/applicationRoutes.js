import express from 'express';
import {
  applyDrive,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Student actions
router.post('/apply/:recruiterId', authorize('student'), applyDrive);
router.get('/my-applications', authorize('student'), getMyApplications);

// Admin actions
router.get('/recruiter/:recruiterId', authorize('admin'), getRecruiterApplications);
router.put('/:id/status', authorize('admin'), updateApplicationStatus);

export default router;
