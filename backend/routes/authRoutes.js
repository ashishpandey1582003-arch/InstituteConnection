import express from 'express';
import {
  registerStudent,
  registerAdmin,
  loginStudent,
  loginAdmin,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Register with multiple fields upload
router.post(
  '/student/register',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]),
  registerStudent
);

router.post('/admin/register', registerAdmin);
router.post('/student/login', loginStudent);
router.post('/admin/login', loginAdmin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/me', protect, getMe);

export default router;
