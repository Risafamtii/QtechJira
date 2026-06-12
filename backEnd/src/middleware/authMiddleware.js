const { verifyToken } = require('../utils/jwtHelper');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Verifies the Bearer token and attaches the current user to req.user.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return sendError(res, 401, 'Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return sendError(res, 401, 'Not authorized, token invalid or expired');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return sendError(res, 401, 'Not authorized, user no longer exists');
  }

  req.user = user;
  return next();
});

module.exports = { protect };
