const User = require('../models/userModels');
const createError = require('../utils/appError');

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated (protect middleware should run first)
    if (!req.user) {
      res.status(401);
      return next(new createError('Not authenticated', 401));
    }

    // Get user from database to check role
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404);
      return next(new createError('User not found', 404));
    }

    // Check if user role is admin
    if (user.role !== 'admin') {
      res.status(403);
      return next(new createError('Access denied. Admin only.', 403));
    }

    // User is admin, proceed
    next();
  } catch (error) {
    next(error);
  }
};
