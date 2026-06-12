const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stats are scoped to the logged-in user's role; all authenticated roles may read.
router.use(protect);
router.get('/stats', dashboardController.getStats);

module.exports = router;
