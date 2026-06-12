const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');
const {
  validateCreateUser,
  validateUpdateUser,
} = require('../utils/validators');

const router = express.Router();

// Every user-management route is Admin-only.
router.use(protect, authorize('Admin'));

router.get('/', userController.list);
router.post('/', validateBody(validateCreateUser), userController.create);
router.get('/:id', userController.getOne);
router.patch('/:id', validateBody(validateUpdateUser), userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
