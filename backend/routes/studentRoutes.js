import express from 'express';
import {
  getStudents,
  updateStudent,
  deleteStudent,
  exportStudentsExcel,
  exportStudentsPDF,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

// Student exports (Admin only)
router.get('/export/excel', authorize('admin'), exportStudentsExcel);
router.get('/export/pdf', authorize('admin'), exportStudentsPDF);

// Admin-only actions: get all students
router.get('/', authorize('admin'), getStudents);

// Dynamic profile update (Student themselves OR Admin)
router.put(
  '/:id',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]),
  updateStudent
);

// Delete student account (Admin only)
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;
