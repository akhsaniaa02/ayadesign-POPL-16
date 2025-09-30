// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized. Token is missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again!',
    });
  }
};

module.exports = { protect };
