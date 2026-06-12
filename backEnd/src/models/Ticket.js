const mongoose = require('mongoose');
const commentSchema = require('./Comment');
const { getNextSequence } = require('./Counter');
const { CATEGORIES, PRIORITIES, STATUSES } = require('../utils/ticketConstants');

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: STATUSES, required: true },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: { type: String, trim: true },
  },
  { _id: false, timestamps: { createdAt: 'changedAt', updatedAt: false } }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: { type: String, enum: CATEGORIES, required: true },
    priority: { type: String, enum: PRIORITIES, required: true },
    status: { type: String, enum: STATUSES, default: 'Open' },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [commentSchema],
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

// Generate a sequential ticket number (TKT-0001) on first save.
ticketSchema.pre('save', async function assignTicketNumber(next) {
  if (!this.isNew || this.ticketNumber) return next();
  try {
    const seq = await getNextSequence('ticket');
    this.ticketNumber = `TKT-${String(seq).padStart(4, '0')}`;
    return next();
  } catch (err) {
    return next(err);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
