const mongoose = require('mongoose');

// Simple named sequence store, used to generate sequential ticket numbers.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // sequence name, e.g. 'ticket'
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

// Atomically increment and return the next value for the named sequence.
const getNextSequence = async (name) => {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return counter.seq;
};

module.exports = { Counter, getNextSequence };
