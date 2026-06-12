import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../features/users/usersSlice';
import useAuth from '../../hooks/useAuth';
import { ROLES, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserForm from '../../components/forms/UserForm';

const ROLE_BADGE = {
  [ROLES.ADMIN]: 'bg-purple-100 text-purple-700',
  [ROLES.AGENT]: 'bg-green-100 text-green-700',
  [ROLES.USER]: 'bg-gray-100 text-gray-700',
};

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();
  const { items, meta, status, error } = useSelector((state) => state.users);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // modal: { mode: 'create' | 'edit', user? } | null
  const [modal, setModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState(null);

  // user pending deletion (drives the confirm dialog), and its in-flight state
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Server-driven search/filter/pagination (debounced).
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        fetchUsers({
          search: search.trim() || undefined,
          role: roleFilter === 'All' ? undefined : roleFilter,
          page,
          limit: pageSize,
        })
      );
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, roleFilter, page, pageSize]);

  const openCreate = () => {
    setFormErrors(null);
    setModal({ mode: 'create' });
  };

  const openEdit = (user) => {
    setFormErrors(null);
    setModal({ mode: 'edit', user });
  };

  const closeModal = () => {
    setModal(null);
    setFormErrors(null);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormErrors(null);

    const action =
      modal.mode === 'create'
        ? createUser(payload)
        : updateUser({ id: modal.user.id, payload });
    const result = await dispatch(action);
    setSubmitting(false);

    const matcher = modal.mode === 'create' ? createUser : updateUser;
    if (matcher.fulfilled.match(result)) {
      closeModal();
    } else {
      setFormErrors(result.payload?.fieldErrors || null);
      // Surface non-field errors (e.g. duplicate email) on the email field.
      if (!result.payload?.fieldErrors && result.payload?.message) {
        setFormErrors({ email: result.payload.message });
      }
    }
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    await dispatch(deleteUser(confirmTarget.id));
    setDeleting(false);
    setConfirmTarget(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add agents and users, edit details, or remove accounts.
          </p>
        </div>
        <Button onClick={openCreate}>+ Add User</Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-64">
          <InputField
            label="Search"
            name="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Name or email"
          />
        </div>
        <div className="sm:w-48">
          <SelectField
            label="Filter by role"
            name="roleFilter"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            options={['All', ROLES.ADMIN, ROLES.AGENT, ROLES.USER]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        {status === 'loading' ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Spinner className="h-5 w-5" /> Loading users…
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-gray-400">(you)</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{u.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          ROLE_BADGE[u.role] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Edit
                        </button>
                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => setConfirmTarget(u)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {status !== 'loading' && !error && items.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <span>
                Page {meta.page} of {meta.totalPages} · {meta.total} total
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAGE_SIZE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={Boolean(modal)}
        title={modal?.mode === 'edit' ? 'Edit User' : 'Add User'}
        onClose={closeModal}
      >
        {modal && (
          <UserForm
            mode={modal.mode}
            initialValues={
              modal.mode === 'edit'
                ? {
                    name: modal.user.name,
                    email: modal.user.email,
                    role: modal.user.role,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={closeModal}
            loading={submitting}
            serverErrors={formErrors}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete user"
        message={
          confirmTarget
            ? `Delete user "${confirmTarget.name}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};

export default UserManagementPage;
