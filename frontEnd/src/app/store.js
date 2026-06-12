import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import ticketsReducer from '../features/tickets/ticketsSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    tickets: ticketsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
