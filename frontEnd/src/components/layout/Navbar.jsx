import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex items-center justify-end gap-4 border-b bg-white px-6 py-3 shadow-sm">
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
    </header>
  );
};

export default Navbar;
