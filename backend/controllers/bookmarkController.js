import Bookmark from '../models/Bookmark.js';
import Recruiter from '../models/Recruiter.js';
import { ErrorResponse, asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Toggle bookmark for a recruiter drive
// @route   POST /api/bookmarks/:recruiterId
// @access  Private/Student
export const toggleBookmark = asyncHandler(async (req, res, next) => {
  const recruiterId = req.params.recruiterId;
  const studentId = req.user._id;

  const recruiter = await Recruiter.findById(recruiterId);
  if (!recruiter) {
    return next(new ErrorResponse('Recruiter drive not found', 404));
  }

  // Check if bookmark already exists
  const existingBookmark = await Bookmark.findOne({
    student: studentId,
    recruiter: recruiterId,
  });

  if (existingBookmark) {
    // Delete bookmark
    await existingBookmark.deleteOne();
    return res.status(200).json({
      success: true,
      bookmarked: false,
      message: 'Bookmark removed successfully',
    });
  } else {
    // Create bookmark
    await Bookmark.create({
      student: studentId,
      recruiter: recruiterId,
    });
    return res.status(200).json({
      success: true,
      bookmarked: true,
      message: 'Bookmark added successfully',
    });
  }
});

// @desc    Get student's bookmarked recruiter drives
// @route   GET /api/bookmarks
// @access  Private/Student
export const getBookmarks = asyncHandler(async (req, res, next) => {
  const bookmarks = await Bookmark.find({ student: req.user._id })
    .populate('recruiter')
    .sort('-createdAt');

  // Map to extract just the recruiter objects
  const bookmarkedDrives = bookmarks.map((b) => b.recruiter).filter(Boolean);

  res.status(200).json({
    success: true,
    count: bookmarkedDrives.length,
    data: bookmarkedDrives,
  });
});
