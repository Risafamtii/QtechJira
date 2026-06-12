import { useSelector } from 'react-redux';

// Convenience selector for auth state across the app.
export const useAuth = () => {
  const { user, token, status, error, fieldErrors } = useSelector(
    (state) => state.auth
  );
  return {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token),
    isLoading: status === 'loading',
    status,
    error,
    fieldErrors,
  };
};

export default useAuth;
