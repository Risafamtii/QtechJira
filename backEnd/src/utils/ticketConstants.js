// Shared ticket enums — imported by the model and validators so values stay in sync.
const CATEGORIES = [
  'Bug',
  'Feature Request',
  'Technical Issue',
  'Payment Issue',
  'Account Issue',
  'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

module.exports = { CATEGORIES, PRIORITIES, STATUSES };
