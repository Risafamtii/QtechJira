import { ROLES } from './constants';

const { ADMIN, AGENT, USER } = ROLES;

// Single source of truth for sidebar navigation. Each item declares which
// roles may see (and reach) it; the Sidebar and route guards both key off this.
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', roles: [ADMIN, AGENT, USER] },
  { label: 'Ticket Management', path: '/admin/tickets', roles: [ADMIN] },
  { label: 'User Management', path: '/admin/users', roles: [ADMIN] },
  { label: 'All Tickets', path: '/tickets', roles: [ADMIN] },
  { label: 'Assigned Tickets', path: '/tickets/assigned', roles: [AGENT] },
  { label: 'My Tickets', path: '/tickets/my', roles: [USER] },
];

export const itemsForRole = (role) =>
  NAV_ITEMS.filter((item) => item.roles.includes(role));

export default NAV_ITEMS;
