const User = require('../models/User');
const { signToken } = require('../utils/jwtHelper');

// Helper to throw errors that the error middleware maps to HTTP statuses.
const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Strip sensitive/internal fields before returning a user to the client.
const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw httpError(409, 'Email is already registered');
  }

  // Self-registration always creates a plain User; roles are assigned by admins.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'User',
  });

  const token = signToken({ id: user._id, role: user.role });
  return { user: toPublicUser(user), token };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // password has `select: false`, so explicitly request it for comparison.
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw httpError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw httpError(401, 'Invalid email or password');
  }

  const token = signToken({ id: user._id, role: user.role });
  return { user: toPublicUser(user), token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError(404, 'User not found');
  }
  return toPublicUser(user);
};

module.exports = { registerUser, loginUser, getMe, toPublicUser };
