import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import Application from '../models/Application.js';
import ActivityLog from '../models/ActivityLog.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get Admin Dashboard Stats and Analytics Chart Data
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res, next) => {
  // 1. Basic Counts
  const totalStudents = await Student.countDocuments();
  const totalUpcomingRecruiters = await Recruiter.countDocuments({
    status: { $in: ['Upcoming', 'Registration Open'] },
  });
  
  // Total applications
  const totalAppliedStudents = await Application.distinct('student').then(
    (arr) => arr.length
  );

  // Today's drives
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todaysRecruiters = await Recruiter.countDocuments({
    driveDate: { $gte: startOfToday, $lte: endOfToday },
  });

  // Recruiters this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const recruitersThisMonth = await Recruiter.countDocuments({
    driveDate: { $gte: startOfMonth },
  });

  const activeDrives = await Recruiter.countDocuments({ status: 'Registration Open' });
  const expiredDrives = await Recruiter.countDocuments({ status: 'Closed' });

  // 2. Charts Data
  
  // A. Recruiters per month (based on driveDate)
  const recruitersPerMonth = await Recruiter.aggregate([
    {
      $group: {
        _id: { $month: '$driveDate' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedRecruitersPerMonth = recruitersPerMonth.map((item) => ({
    name: months[item._id - 1] || 'Unknown',
    recruiters: item.count,
  }));

  // B. Selection Status distribution (Placement statistics)
  const statusStats = await Application.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const placementStats = statusStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // C. Department-wise Placements (Count of selected students per branch)
  const selectedApplications = await Application.find({ status: 'Selected' }).populate('student');
  
  const branchCounts = {};
  selectedApplications.forEach((app) => {
    if (app.student && app.student.branch) {
      branchCounts[app.student.branch] = (branchCounts[app.student.branch] || 0) + 1;
    }
  });

  const departmentAnalytics = Object.keys(branchCounts).map((branch) => ({
    branch: branch,
    selected: branchCounts[branch],
  }));

  // D. Student Application activity ( dts representing recently applied student logs )
  const recentApplications = await Application.find()
    .populate('student', 'name branch')
    .populate('recruiter', 'companyName jobRole')
    .sort('-appliedAt')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      cards: {
        totalStudents,
        totalUpcomingRecruiters,
        totalAppliedStudents,
        todaysRecruiters,
        recruitersThisMonth,
        activeDrives,
        expiredDrives,
      },
      charts: {
        recruitersPerMonth: formattedRecruitersPerMonth,
        placementStats,
        departmentAnalytics,
      },
      recentApplications,
    },
  });
});

// @desc    Get Admin Activity Logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req, res, next) => {
  const logs = await ActivityLog.find()
    .populate('admin', 'name email')
    .sort('-timestamp')
    .limit(100);

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
});
