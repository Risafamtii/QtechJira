import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchTickets,
  deleteTicket,
  createTicket,
  updateTicket,
} from '../../features/tickets/ticketsSlice';
import useAuth from '../../hooks/useAuth';
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
  STATUS_BADGE,
  PRIORITY_BADGE,
  ROLES,
} from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import { canEditTicket, canDeleteTicket } from '../../utils/ticketPermissions';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import Spinner from '../../components/common/Spinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import TicketForm from '../../components/forms/TicketForm';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'priority:desc', label: 'Priority (high→low)' },
  { value: 'status:asc', label: 'Status (A→Z)' },
  { value: 'title:asc', label: 'Title (A→Z)' },
];

const Badge = ({ value, map }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
      map[value] || 'bg-gray-100 text-gray-700'
    }`}
  >
    {value}
  </span>
);

const TicketListPage = ({ title = 'Tickets' }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, meta, listStatus, listError } = useSelector(
    (state) => state.tickets
  );

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    sort: 'createdAt:desc',
  });
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Add/Edit modal: { mode: 'create' | 'edit', ticket? } | null
  const [formModal, setFormModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState(null);

  // Debounce search; reset to page 1 whenever filters/search change.
  useEffect(() => {
    const [sortBy, order] = filters.sort.split(':');
    const handler = setTimeout(() => {
      dispatch(
        fetchTickets({
          search: search.trim() || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          category: filters.category || undefined,
          sortBy,
          order,
          page,
          limit: meta.limit,
        })
      );
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, filters, page]);

  const handleFilter = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    await dispatch(deleteTicket(confirmTarget._id));
    setDeleting(false);
    setConfirmTarget(null);
  };

  const openCreate = () => {
    setFormErrors(null);
    setFormModal({ mode: 'create' });
  };

  const openEdit = (ticket) => {
    setFormErrors(null);
    setFormModal({ mode: 'edit', ticket });
  };

  const closeFormModal = () => {
    setFormModal(null);
    setFormErrors(null);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    setFormErrors(null);

    const result = await dispatch(
      formModal.mode === 'create'
        ? createTicket(payload)
        : updateTicket({ id: formModal.ticket._id, payload })
    );
    setSubmitting(false);

    const matcher = formModal.mode === 'create' ? createTicket : updateTicket;
    if (matcher.fulfilled.match(result)) {
      closeFormModal();
    } else {
      setFormErrors(result.payload?.fieldErrors || null);
    }
  };

  const showCreate = user?.role === ROLES.USER;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {showCreate && <Button onClick={openCreate}>+ Add Ticket</Button>}
      </div>

      {/* Toolbar */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <InputField
          label="Search"
          name="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Number, title, text"
        />
        <SelectField
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleFilter}
          options={[{ value: '', label: 'All statuses' }, ...TICKET_STATUSES]}
        />
        <SelectField
          label="Priority"
          name="priority"
          value={filters.priority}
          onChange={handleFilter}
          options={[{ value: '', label: 'All priorities' }, ...TICKET_PRIORITIES]}
        />
        <SelectField
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleFilter}
          options={[{ value: '', label: 'All categories' }, ...TICKET_CATEGORIES]}
        />
        <SelectField
          label="Sort by"
          name="sort"
          value={filters.sort}
          onChange={handleFilter}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        {listStatus === 'loading' ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Spinner className="h-5 w-5" /> Loading tickets…
          </div>
        ) : listError ? (
          <div className="py-16 text-center text-sm text-red-600">{listError}</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {t.ticketNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link to={`/tickets/${t._id}`} className="hover:text-indigo-600">
                        {t.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.category}</td>
                    <td className="px-4 py-3">
                      <Badge value={t.priority} map={PRIORITY_BADGE} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={t.status} map={STATUS_BADGE} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {t.assignedTo?.name || (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/tickets/${t._id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </Link>
                        {canEditTicket(user, t) && (
                          <button
                            type="button"
                            onClick={() => openEdit(t)}
                            className="font-medium text-gray-600 hover:text-gray-800"
                          >
                            Edit
                          </button>
                        )}
                        {canDeleteTicket(user) && (
                          <button
                            type="button"
                            onClick={() => setConfirmTarget(t)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-600">
            <span>
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </span>
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

      {/* Add / Edit modal */}
      <Modal
        open={Boolean(formModal)}
        title={formModal?.mode === 'edit' ? 'Edit Ticket' : 'Add Ticket'}
        onClose={closeFormModal}
      >
        {formModal && (
          <TicketForm
            mode={formModal.mode}
            initialValues={
              formModal.mode === 'edit'
                ? {
                    title: formModal.ticket.title,
                    description: formModal.ticket.description,
                    category: formModal.ticket.category,
                    priority: formModal.ticket.priority,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={closeFormModal}
            loading={submitting}
            serverErrors={formErrors}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete ticket"
        message={
          confirmTarget
            ? `Delete ticket ${confirmTarget.ticketNumber}? This cannot be undone.`
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

export default TicketListPage;
