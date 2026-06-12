import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { registerThunk, clearAuthError } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, fieldErrors } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = 'Email is invalid';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setLocalErrors(errs);
    if (Object.keys(errs).length) return;

    // New accounts default to the "User" role (assigned server-side).
    const result = await dispatch(registerThunk(form));
    if (registerThunk.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  const fieldError = (name) => localErrors[name] || fieldErrors?.[name];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">
            You&apos;ll be registered as a standard User
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={fieldError('name')}
            placeholder="Jane Doe"
            autoComplete="name"
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={fieldError('email')}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={fieldError('password')}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <Button type="submit" loading={isLoading} className="w-full">
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
