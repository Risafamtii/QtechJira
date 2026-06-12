const Ticket = require('../models/Ticket');
const { roleScopeFilter } = require('./ticketService');
const { STATUSES, PRIORITIES } = require('../utils/ticketConstants');

// Turn aggregation buckets (`{ _id, count }`) into a zero-filled map over `keys`.
const toCountMap = (rows, keys) => {
  const map = Object.fromEntries(keys.map((k) => [k, 0]));
  rows.forEach(({ _id, count }) => {
    if (_id in map) map[_id] = count;
  });
  return map;
};

// Role-scoped ticket statistics for the dashboard summary cards.
const getStats = async (user) => {
  const scope = roleScopeFilter(user);

  const [total, statusRows, priorityRows] = await Promise.all([
    Ticket.countDocuments(scope),
    Ticket.aggregate([
      { $match: scope },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      { $match: scope },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
  ]);

  return {
    total,
    byStatus: toCountMap(statusRows, STATUSES),
    byPriority: toCountMap(priorityRows, PRIORITIES),
  };
};

module.exports = { getStats };
