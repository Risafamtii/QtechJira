const Ticket = require('../models/Ticket');
const User = require('../models/User');

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// --- populate / authorization helpers ------------------------------------

const POPULATE = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email' },
  { path: 'comments.author', select: 'name role' },
  { path: 'statusHistory.changedBy', select: 'name role' },
];

const isOwner = (user, ticket) =>
  String(ticket.createdBy?._id || ticket.createdBy) === String(user._id);

const isAssignee = (user, ticket) =>
  ticket.assignedTo &&
  String(ticket.assignedTo?._id || ticket.assignedTo) === String(user._id);

const canView = (user, ticket) => {
  if (user.role === 'Admin') return true;
  if (user.role === 'Agent') return isAssignee(user, ticket);
  return isOwner(user, ticket); // User
};

// Agents may comment on tickets assigned to them; Users on tickets they created.
// Admins oversee the thread (canView) but do not post comments.
const canComment = (user, ticket) => {
  if (user.role === 'Agent') return isAssignee(user, ticket);
  if (user.role === 'User') return isOwner(user, ticket);
  return false;
};

const canEditCore = (user, ticket) => {
  if (user.role === 'Admin') return true;
  // Owner (User) may edit while the ticket isn't closed.
  return isOwner(user, ticket) && ticket.status !== 'Closed';
};

const loadTicket = async (id) => {
  const ticket = await Ticket.findById(id).populate(POPULATE);
  if (!ticket) throw httpError(404, 'Ticket not found');
  return ticket;
};

// --- service methods -----------------------------------------------------

const createTicket = async (user, { title, description, category, priority }) => {
  const ticket = await Ticket.create({
    title: title.trim(),
    description: description.trim(),
    category,
    priority,
    status: 'Open',
    createdBy: user._id,
    statusHistory: [{ status: 'Open', changedBy: user._id }],
  });
  return ticket.populate(POPULATE);
};

const listTickets = async (user, query = {}) => {
  const {
    status,
    priority,
    category,
    search,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
  } = query;

  // Role scope.
  const filter = {};
  if (user.role === 'Agent') filter.assignedTo = user._id;
  else if (user.role === 'User') filter.createdBy = user._id;

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { ticketNumber: regex },
      { title: regex },
      { description: regex },
    ];
  }

  const allowedSort = ['createdAt', 'priority', 'status', 'title'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
  const sortDir = order === 'asc' ? 1 : -1;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Ticket.find(filter)
      .select('-comments -statusHistory')
      .populate({ path: 'assignedTo', select: 'name role' })
      .populate({ path: 'createdBy', select: 'name' })
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limitNum),
    Ticket.countDocuments(filter),
  ]);

  return {
    items,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.max(Math.ceil(total / limitNum), 1),
  };
};

const getTicketById = async (user, id) => {
  const ticket = await loadTicket(id);
  if (!canView(user, ticket)) {
    throw httpError(403, 'You do not have access to this ticket');
  }
  return ticket;
};

const updateTicket = async (user, id, { title, description, category, priority }) => {
  const ticket = await loadTicket(id);
  if (!canEditCore(user, ticket)) {
    throw httpError(403, 'You are not allowed to edit this ticket');
  }

  ticket.title = title.trim();
  ticket.description = description.trim();
  ticket.category = category;
  ticket.priority = priority;
  await ticket.save();

  return ticket.populate(POPULATE);
};

const deleteTicket = async (user, id) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) throw httpError(404, 'Ticket not found');
  await ticket.deleteOne();
  return { id };
};

const updateStatus = async (user, id, { status, note }) => {
  const ticket = await loadTicket(id);

  const allowed =
    user.role === 'Admin' ||
    (user.role === 'Agent' && isAssignee(user, ticket));
  if (!allowed) {
    throw httpError(403, 'You are not allowed to update this ticket status');
  }

  ticket.status = status;
  ticket.statusHistory.push({
    status,
    changedBy: user._id,
    note: note?.trim() || undefined,
  });
  await ticket.save();

  return ticket.populate(POPULATE);
};

const assignTicket = async (user, id, { assignedTo }) => {
  const ticket = await loadTicket(id);

  const agent = await User.findById(assignedTo);
  if (!agent) throw httpError(404, 'Agent not found');
  if (agent.role !== 'Agent') {
    throw httpError(400, 'Tickets can only be assigned to agents');
  }

  ticket.assignedTo = agent._id;
  await ticket.save();

  return ticket.populate(POPULATE);
};

const addComment = async (user, id, { message }) => {
  const ticket = await loadTicket(id);
  if (!canComment(user, ticket)) {
    throw httpError(403, 'You are not allowed to comment on this ticket');
  }

  ticket.comments.push({ author: user._id, message: message.trim() });
  await ticket.save();

  return ticket.populate(POPULATE);
};

module.exports = {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateStatus,
  assignTicket,
  addComment,
};
