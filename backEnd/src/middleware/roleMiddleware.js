const { sendError } = require('../utils/apiResponse');

// Restricts a route to the given roles. Must run after `protect`.
// Usage: router.get('/', protect, authorize('Admin'), handler)
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Not authorized');
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: insufficient permissions');
    }
    return next();
  };

module.exports = { authorize };
