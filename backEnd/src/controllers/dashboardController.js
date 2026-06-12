const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const dashboardService = require('../services/dashboardService');

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats(req.user);
  return sendSuccess(res, 200, 'Dashboard stats', stats);
});

module.exports = { getStats };
