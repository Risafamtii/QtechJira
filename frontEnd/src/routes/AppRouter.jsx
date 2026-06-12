import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import AppLayout from '../components/layout/AppLayout';
import { ROLES } from '../utils/constants';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TicketListPage from '../pages/tickets/TicketListPage';
import CreateTicketPage from '../pages/tickets/CreateTicketPage';
import UserManagementPage from '../pages/users/UserManagementPage';
import PlaceholderPage from '../components/common/PlaceholderPage';

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

        {/* Admin */}
        <Route element={<RoleRoute allow={[ADMIN]} />}>
          <Route
            path="/admin/tickets"
            element={<PlaceholderPage title="Ticket Management" />}
          />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/tickets" element={<TicketListPage />} />
        </Route>

        {/* Agent */}
        <Route element={<RoleRoute allow={[AGENT]} />}>
          <Route
            path="/tickets/assigned"
            element={<PlaceholderPage title="Assigned Tickets" />}
          />
        </Route>

        {/* User */}
        <Route element={<RoleRoute allow={[USER]} />}>
          <Route
            path="/tickets/my"
            element={<PlaceholderPage title="My Tickets" />}
          />
          <Route path="/tickets/create" element={<CreateTicketPage />} />
        </Route>
      </Route>
    </Route>

    {/* Defaults */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRouter;
