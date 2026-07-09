import express from 'express';
import {
  getRecruiters,
  getRecruiter,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter,
} from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

// Retrieve recruiters list & details (accessible by both student and admin)
router.get('/', getRecruiters);
router.get('/:id', getRecruiter);

// Creation (Admin only, handles multiple files: logo, brochure, pdfNotification)
router.post(
  '/',
  authorize('admin'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'brochure', maxCount: 1 },
    { name: 'pdfNotification', maxCount: 1 },
  ]),
  createRecruiter
);

// Edit (Admin only, updates files if provided)
router.put(
  '/:id',
  authorize('admin'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'brochure', maxCount: 1 },
    { name: 'pdfNotification', maxCount: 1 },
  ]),
  updateRecruiter
);

// Delete (Admin only)
router.delete('/:id', authorize('admin'), deleteRecruiter);

export default router;
