export const ROLES = {
  ADMIN: 'Admin',
  AGENT: 'Agent',
  USER: 'User',
};

// Roles an admin may assign through user management.
export const ASSIGNABLE_ROLES = [ROLES.AGENT, ROLES.USER];

// Ticket enums (mirror backend src/utils/ticketConstants.js).
export const TICKET_CATEGORIES = [
  'Bug',
  'Feature Request',
  'Technical Issue',
  'Payment Issue',
  'Account Issue',
  'Other',
];

export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const STATUS_BADGE = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-200 text-gray-600',
};

export const PRIORITY_BADGE = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-sky-100 text-sky-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

// Rows-per-page options for paginated tables.
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 / page' },
  { value: 25, label: '25 / page' },
  { value: 50, label: '50 / page' },
];

export const TOKEN_KEY = 'tms_token';
export const USER_KEY = 'tms_user';
