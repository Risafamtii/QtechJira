import { ROLES } from './constants';

// Mirrors the backend authorization rules so the UI shows the right actions.
// `user` is the logged-in user (with `id` + `role`); `ticket` is a populated ticket.

const ownerId = (ticket) => ticket?.createdBy?._id || ticket?.createdBy;
const assigneeId = (ticket) => ticket?.assignedTo?._id || ticket?.assignedTo;

export const isOwner = (user, ticket) =>
  user && String(ownerId(ticket)) === String(user.id);

export const isAssignee = (user, ticket) =>
  user && assigneeId(ticket) && String(assigneeId(ticket)) === String(user.id);

export const canEditTicket = (user, ticket) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  return isOwner(user, ticket) && ticket.status !== 'Closed';
};

export const canDeleteTicket = (user) => user?.role === ROLES.ADMIN;

export const canUpdateStatus = (user, ticket) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  return user.role === ROLES.AGENT && isAssignee(user, ticket);
};

export const canAssignTicket = (user) => user?.role === ROLES.ADMIN;

// Only agents (on assigned tickets) and users (on their own) may post comments.
// Admins can view/oversee the thread but cannot comment.
export const canCommentTicket = (user, ticket) => {
  if (!user) return false;
  if (user.role === ROLES.AGENT) return isAssignee(user, ticket);
  if (user.role === ROLES.USER) return isOwner(user, ticket);
  return false;
};
