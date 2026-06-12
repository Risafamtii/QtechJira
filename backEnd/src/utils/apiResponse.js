// Single common response shape for the whole API.
// Success: { success: true, message, data }
// Error:   { success: false, message, errors }

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) =>
  res.status(statusCode).json({ success: true, message, data });

const sendError = (res, statusCode = 500, message = 'Error', errors = null) =>
  res.status(statusCode).json({ success: false, message, errors });

module.exports = { sendSuccess, sendError };
