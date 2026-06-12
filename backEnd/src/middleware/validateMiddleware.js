const { sendError } = require('../utils/apiResponse');

// Runs a validator function against req.body and returns 422 with the
// collected field errors if any are found.
const validateBody = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req.body);
  if (errors && Object.keys(errors).length > 0) {
    return sendError(res, 422, 'Validation failed', errors);
  }
  return next();
};

module.exports = { validateBody };
