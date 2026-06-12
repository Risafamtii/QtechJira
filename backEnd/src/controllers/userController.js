const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const userService = require('../services/userService');

const list = asyncHandler(async (req, res) => {
  const result = await userService.listUsers({
    role: req.query.role,
    search: req.query.search,
    page: req.query.page,
    limit: req.query.limit,
  });
  return sendSuccess(res, 200, 'Users fetched', result);
});

const getOne = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, 200, 'User fetched', { user });
});

const create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return sendSuccess(res, 201, 'User created', { user });
});

const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return sendSuccess(res, 200, 'User updated', { user });
});

const remove = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.user._id);
  return sendSuccess(res, 200, 'User deleted', result);
});

module.exports = { list, getOne, create, update, remove };
