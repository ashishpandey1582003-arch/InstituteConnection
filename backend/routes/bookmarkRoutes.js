import express from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.post('/:recruiterId', toggleBookmark);
router.get('/', getBookmarks);

export default router;
