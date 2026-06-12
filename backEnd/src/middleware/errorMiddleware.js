const { sendError } = require('../utils/apiResponse');

// Centralized error handler. Mounted last in app.js.
// Translates common Mongoose / JWT errors into the common response shape.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Invalid MongoDB ObjectId (e.g. malformed :id param).
  if (err.name === 'CastError') {
    return sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  // Duplicate key (e.g. email already registered).
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 409, `Duplicate value for ${field}`, {
      [field]: `${field} already exists`,
    });
  }

  // Mongoose schema validation.
  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(
      Object.values(err.errors).map((e) => [e.path, e.message])
    );
    return sendError(res, 422, 'Validation failed', errors);
  }

  // JWT errors (defensive — auth middleware handles these too).
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Not authorized, token invalid or expired');
  }

  const statusCode = err.statusCode || 500;
  if (statusCode === 500) {
    console.error(err);
  }
  return sendError(res, statusCode, err.message || 'Internal server error');
};

// 404 handler for unmatched routes.
const notFound = (req, res) =>
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);

module.exports = { errorHandler, notFound };
