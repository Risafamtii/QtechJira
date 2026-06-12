import axiosInstance from './axiosInstance';

// Each function returns the parsed `data` payload from the common API shape.
const login = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data.data; // { user, token }
};

const register = async (payload) => {
  const { data } = await axiosInstance.post('/auth/register', payload);
  return data.data; // { user, token }
};

const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data.data.user;
};

export default { login, register, getMe };
