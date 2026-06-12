const User = require('../models/User');
const { toPublicUser } = require('./authService');
const { ASSIGNABLE_ROLES } = require('../utils/validators');

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Admins may only assign Agent/User; anything else falls back to User.
const clampRole = (role) => (ASSIGNABLE_ROLES.includes(role) ? role : 'User');

const listUsers = async ({ role, search } = {}) => {
  const query = {};
  if (role && ASSIGNABLE_ROLES.concat('Admin').includes(role)) {
    query.role = role;
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  const users = await User.find(query).sort({ createdAt: -1 });
  return users.map(toPublicUser);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw httpError(404, 'User not found');
  return toPublicUser(user);
};

const createUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw httpError(409, 'Email is already registered');

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: clampRole(role),
  });

  return toPublicUser(user);
};

const updateUser = async (id, { name, email, role }) => {
  const user = await User.findById(id);
  if (!user) throw httpError(404, 'User not found');

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== user.email) {
    const clash = await User.findOne({ email: normalizedEmail });
    if (clash) throw httpError(409, 'Email is already registered');
    user.email = normalizedEmail;
  }

  user.name = name.trim();
  user.role = clampRole(role);
  await user.save();

  return toPublicUser(user);
};

const deleteUser = async (id, currentUserId) => {
  if (String(id) === String(currentUserId)) {
    throw httpError(400, 'You cannot delete your own account');
  }

  const user = await User.findById(id);
  if (!user) throw httpError(404, 'User not found');

  await user.deleteOne();
  return { id };
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
