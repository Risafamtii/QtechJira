import { useState } from 'react';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import Button from '../common/Button';
import { ASSIGNABLE_ROLES, ROLES } from '../../utils/constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyValues = { name: '', email: '', password: '', role: ROLES.USER };

// Reusable create/edit form. In 'edit' mode the password field is hidden.
const UserForm = ({
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  serverErrors,
}) => {
  const isCreate = mode === 'create';
  const [form, setForm] = useState({ ...emptyValues, ...initialValues });
  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = 'Email is invalid';
    if (!ASSIGNABLE_ROLES.includes(form.role)) errs.role = 'Select a role';
    if (isCreate) {
      if (!form.password) errs.password = 'Password is required';
      else if (form.password.length < 6)
        errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setLocalErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    if (isCreate) payload.password = form.password;
    onSubmit(payload);
  };

  const fieldError = (name) => localErrors[name] || serverErrors?.[name];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <InputField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={fieldError('name')}
        placeholder="Jane Doe"
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={fieldError('email')}
        placeholder="jane@example.com"
      />
      {isCreate && (
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
      )}
      <SelectField
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        error={fieldError('role')}
        options={ASSIGNABLE_ROLES}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isCreate ? 'Create user' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
