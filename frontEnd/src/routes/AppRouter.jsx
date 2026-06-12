import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import AppLayout from '../components/layout/AppLayout';
import { ROLES } from '../utils/constants';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TicketListPage from '../pages/tickets/TicketListPage';
import TicketDetailsPage from '../pages/tickets/TicketDetailsPage';
import UserManagementPage from '../pages/users/UserManagementPage';

const { ADMIN, AGENT, USER } = ROLES;

const AppRouter = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Authenticated app shell */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        {/* All roles */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Ticket details — access enforced by the API per role */}
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />

        {/* Admin */}
        <Route element={<RoleRoute allow={[ADMIN]} />}>
          <Route
            path="/admin/tickets"
            element={<TicketListPage title="Ticket Management" />}
          />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/tickets" element={<TicketListPage title="All Tickets" />} />
        </Route>

        {/* Agent */}
        <Route element={<RoleRoute allow={[AGENT]} />}>
          <Route
            path="/tickets/assigned"
            element={<TicketListPage title="Assigned Tickets" />}
          />
        </Route>

        {/* User */}
        <Route element={<RoleRoute allow={[USER]} />}>
          <Route path="/tickets/my" element={<TicketListPage title="My Tickets" />} />
        </Route>
      </Route>
    </Route>

    {/* Defaults */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRouter;
