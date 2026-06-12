import axiosInstance from './axiosInstance';

// Returns the role-scoped stats: { total, byStatus, byPriority }.
const getStats = async () => {
  const { data } = await axiosInstance.get('/dashboard/stats');
  return data.data;
};

export default { getStats };
