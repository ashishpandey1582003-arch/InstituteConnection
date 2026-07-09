import jwt from 'jsonwebtoken';
import { ErrorResponse, asyncHandler } from './errorMiddleware.js';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read token from cookies (HttpOnly cookie setup)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Fallback to Bearer token in Headers (useful for testing)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user based on role
    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id);
      if (!req.user) {
        return next(new ErrorResponse('Admin not found', 401));
      }
      req.user.role = 'admin';
    } else {
      req.user = await Student.findById(decoded.id);
      if (!req.user) {
        return next(new ErrorResponse('Student not found', 401));
      }
      req.user.role = 'student';
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
