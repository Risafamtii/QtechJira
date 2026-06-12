import { useState } from 'react';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import Button from '../common/Button';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../utils/constants';

const emptyValues = {
  title: '',
  description: '',
  category: TICKET_CATEGORIES[0],
  priority: 'Medium',
};

// Reusable create/edit form for a ticket's core fields.
const TicketForm = ({
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  serverErrors,
}) => {
  const [form, setForm] = useState({ ...emptyValues, ...initialValues });
  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!TICKET_CATEGORIES.includes(form.category)) errs.category = 'Select a category';
    if (!TICKET_PRIORITIES.includes(form.priority)) errs.priority = 'Select a priority';
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

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
    });
  };

  const fieldError = (name) => localErrors[name] || serverErrors?.[name];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <InputField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={fieldError('title')}
        placeholder="Brief summary of the issue"
      />

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail"
          className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
            fieldError('description')
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
        {fieldError('description') && (
          <p className="text-xs text-red-600">{fieldError('description')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          error={fieldError('category')}
          options={TICKET_CATEGORIES}
        />
        <SelectField
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          error={fieldError('priority')}
          options={TICKET_PRIORITIES}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {mode === 'edit' ? 'Save changes' : 'Create ticket'}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
