import { useState } from 'react';
import Button from '../common/Button';

// Add-a-comment form. Calls onSubmit(message) and clears on success.
const CommentForm = ({ onSubmit, loading = false }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    const ok = await onSubmit(message.trim());
    if (ok) setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        rows={3}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setError(null);
        }}
        placeholder="Add a comment…"
        className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Add comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
