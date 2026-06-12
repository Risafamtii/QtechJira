const express = require('express');
const ticketController = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');
const {
  validateCreateTicket,
  validateUpdateTicket,
  validateStatusUpdate,
  validateAssign,
  validateComment,
} = require('../utils/validators');

const router = express.Router();

// All ticket routes require authentication; finer per-ticket checks live in the service.
router.use(protect);

router.post(
  '/',
  authorize('User'),
  validateBody(validateCreateTicket),
  ticketController.create
);
router.get('/', ticketController.list);
router.get('/:id', ticketController.getOne);
router.patch(
  '/:id',
  authorize('Admin', 'User'),
  validateBody(validateUpdateTicket),
  ticketController.update
);
router.delete('/:id', authorize('Admin'), ticketController.remove);
router.patch(
  '/:id/status',
  authorize('Admin', 'Agent'),
  validateBody(validateStatusUpdate),
  ticketController.updateStatus
);
router.patch(
  '/:id/assign',
  authorize('Admin'),
  validateBody(validateAssign),
  ticketController.assign
);
router.post(
  '/:id/comments',
  validateBody(validateComment),
  ticketController.addComment
);

module.exports = router;
