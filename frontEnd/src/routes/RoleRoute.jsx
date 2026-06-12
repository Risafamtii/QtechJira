import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Gates child routes by role. Must sit under ProtectedRoute (auth already checked).
// Unauthorized roles are bounced to the dashboard, which every role can access.
const RoleRoute = ({ allow = [] }) => {
  const { role } = useAuth();

  if (!allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
