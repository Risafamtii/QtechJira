const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');
const { validateRegister, validateLogin } = require('../utils/validators');

const router = express.Router();

router.post('/register', validateBody(validateRegister), authController.register);
router.post('/login', validateBody(validateLogin), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
