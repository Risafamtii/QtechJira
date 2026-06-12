import axiosInstance from './axiosInstance';

// Each function returns the unwrapped `data` payload from the common API shape.
const listTickets = async (params = {}) => {
  const { data } = await axiosInstance.get('/tickets', { params });
  return data.data; // { items, page, limit, total, totalPages }
};

const getTicket = async (id) => {
  const { data } = await axiosInstance.get(`/tickets/${id}`);
  return data.data.ticket;
};

const createTicket = async (payload) => {
  const { data } = await axiosInstance.post('/tickets', payload);
  return data.data.ticket;
};

const updateTicket = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/tickets/${id}`, payload);
  return data.data.ticket;
};

const deleteTicket = async (id) => {
  const { data } = await axiosInstance.delete(`/tickets/${id}`);
  return data.data; // { id }
};

const updateStatus = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/tickets/${id}/status`, payload);
  return data.data.ticket;
};

const assignTicket = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/tickets/${id}/assign`, payload);
  return data.data.ticket;
};

const addComment = async (id, payload) => {
  const { data } = await axiosInstance.post(`/tickets/${id}/comments`, payload);
  return data.data.ticket;
};

export default {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  updateStatus,
  assignTicket,
  addComment,
};
