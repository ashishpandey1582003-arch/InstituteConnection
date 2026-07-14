import Recruiter from '../models/Recruiter.js';
import ActivityLog from '../models/ActivityLog.js';
import { ErrorResponse, asyncHandler } from '../middleware/errorMiddleware.js';
import { uploadFileToCloud } from '../utils/cloudinary.js';


// @desc    Get all recruiters
// @route   GET /api/recruiters
// @access  Private
export const getRecruiters = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc.)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Base Query
  let mongoQuery = JSON.parse(queryStr);

  // Implement advanced search by companyName or jobRole
  if (req.query.search) {
    mongoQuery.$or = [
      { companyName: { $regex: req.query.search, $options: 'i' } },
      { jobRole: { $regex: req.query.search, $options: 'i' } },
      { skillsRequired: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Filter based on eligibility if student role
  if (req.user.role === 'student') {
    // Standard student might view all, but frontend can filter by eligible/all.
    // Let's provide all recruiters by default and let frontend run calculations.
  }

  query = Recruiter.find(mongoQuery);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sorting
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Recruiter.countDocuments(mongoQuery);

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const recruiters = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: recruiters.length,
    pagination,
    total,
    data: recruiters,
  });
});

// @desc    Get single recruiter drive
// @route   GET /api/recruiters/:id
// @access  Private
export const getRecruiter = asyncHandler(async (req, res, next) => {
  const recruiter = await Recruiter.findById(req.params.id);

  if (!recruiter) {
    return next(new ErrorResponse(`Recruiter not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: recruiter,
  });
});

// @desc    Create a recruiter drive
// @route   POST /api/recruiters
// @access  Private/Admin
export const createRecruiter = asyncHandler(async (req, res, next) => {
  // Capture upload file names
  let logoPath = '';
  let brochurePath = '';
  let pdfNotificationPath = '';

  if (req.files) {
    if (req.files.logo && req.files.logo[0]) {
      const localLogo = `/uploads/logos/${req.files.logo[0].filename}`;
      logoPath = await uploadFileToCloud(req.files.logo[0], 'logos', localLogo);
    }
    if (req.files.brochure && req.files.brochure[0]) {
      const localBrochure = `/uploads/brochures/${req.files.brochure[0].filename}`;
      brochurePath = await uploadFileToCloud(req.files.brochure[0], 'brochures', localBrochure);
    }
    if (req.files.pdfNotification && req.files.pdfNotification[0]) {
      const localPdf = `/uploads/notifications/${req.files.pdfNotification[0].filename}`;
      pdfNotificationPath = await uploadFileToCloud(req.files.pdfNotification[0], 'notifications', localPdf);
    }
  }

  // Parse arrays
  let allowedBranches = [];
  if (req.body.allowedBranches) {
    try {
      allowedBranches = typeof req.body.allowedBranches === 'string' 
        ? JSON.parse(req.body.allowedBranches) 
        : req.body.allowedBranches;
    } catch (e) {
      allowedBranches = req.body.allowedBranches.split(',').map((b) => b.trim());
    }
  }

  let skillsRequired = [];
  if (req.body.skillsRequired) {
    try {
      skillsRequired = typeof req.body.skillsRequired === 'string' 
        ? JSON.parse(req.body.skillsRequired) 
        : req.body.skillsRequired;
    } catch (e) {
      skillsRequired = req.body.skillsRequired.split(',').map((s) => s.trim());
    }
  }

  // Parse nested prepMaterial fields
  let prepMaterial = {
    interviewPrep: req.body.interviewPrep || '',
    prevQuestions: [],
    codingQuestions: [],
    aptitudeTopics: [],
    hrQuestions: [],
    resources: []
  };

  const arrayPrepFields = ['prevQuestions', 'codingQuestions', 'aptitudeTopics', 'hrQuestions', 'resources'];
  arrayPrepFields.forEach(field => {
    if (req.body[field]) {
      try {
        prepMaterial[field] = typeof req.body[field] === 'string'
          ? JSON.parse(req.body[field])
          : req.body[field];
      } catch (e) {
        prepMaterial[field] = req.body[field].split(',').map(item => item.trim());
      }
    }
  });

  const recruiterData = {
    ...req.body,
    logo: logoPath,
    brochure: brochurePath,
    pdfNotification: pdfNotificationPath,
    allowedBranches,
    skillsRequired,
    prepMaterial,
  };

  const recruiter = await Recruiter.create(recruiterData);

  // Log activity
  await ActivityLog.create({
    admin: req.user._id,
    action: 'CREATE_RECRUITER',
    details: `Created recruitment drive for ${recruiter.companyName} (${recruiter.jobRole})`,
  });

  res.status(201).json({
    success: true,
    data: recruiter,
  });
});

// @desc    Update a recruiter drive
// @route   PUT /api/recruiters/:id
// @access  Private/Admin
export const updateRecruiter = asyncHandler(async (req, res, next) => {
  let recruiter = await Recruiter.findById(req.params.id);

  if (!recruiter) {
    return next(new ErrorResponse(`Recruiter not found with id of ${req.params.id}`, 404));
  }

  // Handle file uploads (only override if new files are passed)
  let logoPath = recruiter.logo;
  let brochurePath = recruiter.brochure;
  let pdfNotificationPath = recruiter.pdfNotification;

  if (req.files) {
    if (req.files.logo && req.files.logo[0]) {
      const localLogo = `/uploads/logos/${req.files.logo[0].filename}`;
      logoPath = await uploadFileToCloud(req.files.logo[0], 'logos', localLogo);
    }
    if (req.files.brochure && req.files.brochure[0]) {
      const localBrochure = `/uploads/brochures/${req.files.brochure[0].filename}`;
      brochurePath = await uploadFileToCloud(req.files.brochure[0], 'brochures', localBrochure);
    }
    if (req.files.pdfNotification && req.files.pdfNotification[0]) {
      const localPdf = `/uploads/notifications/${req.files.pdfNotification[0].filename}`;
      pdfNotificationPath = await uploadFileToCloud(req.files.pdfNotification[0], 'notifications', localPdf);
    }
  }

  // Parse arrays
  let allowedBranches = recruiter.allowedBranches;
  if (req.body.allowedBranches) {
    try {
      allowedBranches = typeof req.body.allowedBranches === 'string' 
        ? JSON.parse(req.body.allowedBranches) 
        : req.body.allowedBranches;
    } catch (e) {
      allowedBranches = req.body.allowedBranches.split(',').map((b) => b.trim());
    }
  }

  let skillsRequired = recruiter.skillsRequired;
  if (req.body.skillsRequired) {
    try {
      skillsRequired = typeof req.body.skillsRequired === 'string' 
        ? JSON.parse(req.body.skillsRequired) 
        : req.body.skillsRequired;
    } catch (e) {
      skillsRequired = req.body.skillsRequired.split(',').map((s) => s.trim());
    }
  }

  // Parse nested prepMaterial fields
  let prepMaterial = recruiter.prepMaterial || {
    interviewPrep: '',
    prevQuestions: [],
    codingQuestions: [],
    aptitudeTopics: [],
    hrQuestions: [],
    resources: []
  };

  if (req.body.interviewPrep !== undefined) prepMaterial.interviewPrep = req.body.interviewPrep;

  const arrayPrepFields = ['prevQuestions', 'codingQuestions', 'aptitudeTopics', 'hrQuestions', 'resources'];
  arrayPrepFields.forEach(field => {
    if (req.body[field] !== undefined) {
      try {
        prepMaterial[field] = typeof req.body[field] === 'string'
          ? JSON.parse(req.body[field])
          : req.body[field];
      } catch (e) {
        prepMaterial[field] = req.body[field].split(',').map(item => item.trim());
      }
    }
  });

  const updatedData = {
    ...req.body,
    logo: logoPath,
    brochure: brochurePath,
    pdfNotification: pdfNotificationPath,
    allowedBranches,
    skillsRequired,
    prepMaterial,
  };

  recruiter = await Recruiter.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  // Log activity
  await ActivityLog.create({
    admin: req.user._id,
    action: 'UPDATE_RECRUITER',
    details: `Updated recruitment drive details for ${recruiter.companyName} (${recruiter.jobRole})`,
  });

  res.status(200).json({
    success: true,
    data: recruiter,
  });
});

// @desc    Delete a recruiter drive
// @route   DELETE /api/recruiters/:id
// @access  Private/Admin
export const deleteRecruiter = asyncHandler(async (req, res, next) => {
  const recruiter = await Recruiter.findById(req.params.id);

  if (!recruiter) {
    return next(new ErrorResponse(`Recruiter not found with id of ${req.params.id}`, 404));
  }

  await recruiter.deleteOne();

  // Log activity
  await ActivityLog.create({
    admin: req.user._id,
    action: 'DELETE_RECRUITER',
    details: `Deleted recruitment drive for ${recruiter.companyName}`,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});
