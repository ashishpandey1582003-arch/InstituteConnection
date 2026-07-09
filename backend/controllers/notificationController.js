import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import { ErrorResponse, asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Create and broadcast notification (Admin only)
// @route   POST /api/notifications
// @access  Private/Admin
export const createNotification = asyncHandler(async (req, res, next) => {
  const { title, message, type, targetBranches, targetYears } = req.body;

  if (!title || !message) {
    return next(new ErrorResponse('Please add a title and message body', 400));
  }

  // Create notice
  const notification = await Notification.create({
    title,
    message,
    type: type || 'All',
    targetBranches: targetBranches || [],
    targetYears: targetYears || [],
    sender: req.user._id,
  });

  // Log activity
  await ActivityLog.create({
    admin: req.user._id,
    action: 'CREATE_NOTIFICATION',
    details: `Broadcasted notification: "${title}" (Type: ${type || 'All'})`,
  });

  res.status(201).json({
    success: true,
    data: notification,
  });
});

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res, next) => {
  let query = {};

  // If student, filter by eligibility cohort (All, Branch-specific, Year-specific)
  if (req.user.role === 'student') {
    const studentBranch = req.user.branch;
    const studentYear = req.user.year;

    query = {
      $or: [
        { type: 'All' },
        { type: 'Branch-wise', targetBranches: studentBranch },
        { type: 'Year-wise', targetYears: studentYear },
      ],
    };
  }

  const notifications = await Notification.find(query)
    .populate('sender', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});
