import axiosInstance from './axiosInstance';

// Each function returns the unwrapped `data` payload from the common API shape.
const listUsers = async (params = {}) => {
  const { data } = await axiosInstance.get('/users', { params });
  return data.data; // { items, page, limit, total, totalPages }
};

const createUser = async (payload) => {
  const { data } = await axiosInstance.post('/users', payload);
  return data.data.user;
};

const updateUser = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/users/${id}`, payload);
  return data.data.user;
};

const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data.data; // { id }
};

export default { listUsers, createUser, updateUser, deleteUser };
