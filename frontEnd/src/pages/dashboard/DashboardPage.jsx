import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600">
              {user.name}{' '}
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {user.role}
              </span>
            </span>
          )}
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h2 className="text-xl font-medium text-gray-700">Dashboard — coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Ticket statistics and summary cards will appear here.
        </p>
      </main>
    </div>
  );
};

export default DashboardPage;
