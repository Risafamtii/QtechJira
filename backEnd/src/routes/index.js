const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const ticketRoutes = require('./ticketRoutes');

const router = express.Router();

router.get('/health', (req, res) =>
  res.json({ success: true, message: 'API is running' })
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
