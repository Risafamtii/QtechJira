// Lightweight, dependency-free validators. Each returns an `errors` object
// keyed by field name; an empty object means the payload is valid.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const validateRegister = (body = {}) => {
  const errors = {};
  const { name, email, password } = body;

  if (!isNonEmptyString(name)) errors.name = 'Name is required';
  if (!isNonEmptyString(email)) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Email is invalid';
  }
  if (!isNonEmptyString(password)) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

const validateLogin = (body = {}) => {
  const errors = {};
  const { email, password } = body;

  if (!isNonEmptyString(email)) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Email is invalid';
  }
  if (!isNonEmptyString(password)) errors.password = 'Password is required';

  return errors;
};

module.exports = { validateRegister, validateLogin };
