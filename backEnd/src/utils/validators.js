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

// Roles an admin is allowed to assign through user management.
const ASSIGNABLE_ROLES = ['Agent', 'User'];

const {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
} = require('./ticketConstants');

const validateTicketFields = (body = {}) => {
  const errors = {};
  const { title, description, category, priority } = body;

  if (!isNonEmptyString(title)) errors.title = 'Title is required';
  if (!isNonEmptyString(description))
    errors.description = 'Description is required';
  if (!CATEGORIES.includes(category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(', ')}`;
  }
  if (!PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}`;
  }

  return errors;
};

const validateCreateTicket = (body) => validateTicketFields(body);
const validateUpdateTicket = (body) => validateTicketFields(body);

const validateStatusUpdate = (body = {}) => {
  const errors = {};
  if (!STATUSES.includes(body.status)) {
    errors.status = `Status must be one of: ${STATUSES.join(', ')}`;
  }
  return errors;
};

const validateAssign = (body = {}) => {
  const errors = {};
  if (!isNonEmptyString(body.assignedTo)) {
    errors.assignedTo = 'An agent is required';
  }
  return errors;
};

const validateComment = (body = {}) => {
  const errors = {};
  if (!isNonEmptyString(body.message)) {
    errors.message = 'Comment cannot be empty';
  }
  return errors;
};

const validateCreateUser = (body = {}) => {
  const errors = {};
  const { name, email, password, role } = body;

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
  if (role !== undefined && !ASSIGNABLE_ROLES.includes(role)) {
    errors.role = `Role must be one of: ${ASSIGNABLE_ROLES.join(', ')}`;
  }

  return errors;
};

const validateUpdateUser = (body = {}) => {
  const errors = {};
  const { name, email, role } = body;

  if (!isNonEmptyString(name)) errors.name = 'Name is required';
  if (!isNonEmptyString(email)) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Email is invalid';
  }
  if (!ASSIGNABLE_ROLES.includes(role)) {
    errors.role = `Role must be one of: ${ASSIGNABLE_ROLES.join(', ')}`;
  }

  return errors;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  ASSIGNABLE_ROLES,
  validateCreateTicket,
  validateUpdateTicket,
  validateStatusUpdate,
  validateAssign,
  validateComment,
};
