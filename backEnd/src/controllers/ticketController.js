const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ticketService = require('../services/ticketService');

const create = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.user, req.body);
  return sendSuccess(res, 201, 'Ticket created', { ticket });
});

const list = asyncHandler(async (req, res) => {
  const result = await ticketService.listTickets(req.user, req.query);
  return sendSuccess(res, 200, 'Tickets fetched', result);
});

const getOne = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getTicketById(req.user, req.params.id);
  return sendSuccess(res, 200, 'Ticket fetched', { ticket });
});

const update = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicket(req.user, req.params.id, req.body);
  return sendSuccess(res, 200, 'Ticket updated', { ticket });
});

const remove = asyncHandler(async (req, res) => {
  const result = await ticketService.deleteTicket(req.user, req.params.id);
  return sendSuccess(res, 200, 'Ticket deleted', result);
});

const updateStatus = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateStatus(req.user, req.params.id, req.body);
  return sendSuccess(res, 200, 'Ticket status updated', { ticket });
});

const assign = asyncHandler(async (req, res) => {
  const ticket = await ticketService.assignTicket(req.user, req.params.id, req.body);
  return sendSuccess(res, 200, 'Ticket assigned', { ticket });
});

const addComment = asyncHandler(async (req, res) => {
  const ticket = await ticketService.addComment(req.user, req.params.id, req.body);
  return sendSuccess(res, 201, 'Comment added', { ticket });
});

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
  updateStatus,
  assign,
  addComment,
};
