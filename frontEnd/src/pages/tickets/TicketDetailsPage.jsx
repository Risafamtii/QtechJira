import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTicket,
  deleteTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  addComment,
  clearCurrentTicket,
} from '../../features/tickets/ticketsSlice';
import userApi from '../../api/userApi';
import useAuth from '../../hooks/useAuth';
import { TICKET_STATUSES, STATUS_BADGE, PRIORITY_BADGE } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';
import {
  canEditTicket,
  canDeleteTicket,
  canUpdateStatus,
  canAssignTicket,
  canCommentTicket,
} from '../../utils/ticketPermissions';
import Button from '../../components/common/Button';
import SelectField from '../../components/common/SelectField';
import Spinner from '../../components/common/Spinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import CommentForm from '../../components/forms/CommentForm';
import TicketForm from '../../components/forms/TicketForm';

const Badge = ({ value, map }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
      map[value] || 'bg-gray-100 text-gray-700'
    }`}
  >
    {value}
  </span>
);

const Card = ({ title, children }) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    {title && <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>}
    {children}
  </div>
);

const TicketDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { current, detailStatus, detailError } = useSelector(
    (state) => state.tickets
  );

  const [actionError, setActionError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editErrors, setEditErrors] = useState(null);

  const [statusValue, setStatusValue] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);

  const [agents, setAgents] = useState([]);
  const [assignValue, setAssignValue] = useState('');
  const [assignSaving, setAssignSaving] = useState(false);

  const [commentSaving, setCommentSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTicket(id));
    return () => dispatch(clearCurrentTicket());
  }, [dispatch, id]);

  // Sync local controls when the ticket loads/changes.
  useEffect(() => {
    if (current) {
      setStatusValue(current.status);
      setAssignValue(current.assignedTo?._id || '');
    }
  }, [current]);

  // Admins need the agent list to assign.
  useEffect(() => {
    if (current && canAssignTicket(user)) {
      userApi
        .listUsers({ role: 'Agent' })
        .then(setAgents)
        .catch(() => setAgents([]));
    }
  }, [current, user]);

  if (detailStatus === 'loading' || (detailStatus === 'idle' && !current)) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
        <Spinner className="h-5 w-5" /> Loading ticket…
      </div>
    );
  }

  if (detailStatus === 'failed' || !current) {
    return (
      <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
        {detailError || 'Ticket not found.'}
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    setActionError(null);
    setStatusSaving(true);
    const result = await dispatch(
      updateTicketStatus({
        id,
        payload: { status: statusValue, note: statusNote.trim() || undefined },
      })
    );
    setStatusSaving(false);
    if (updateTicketStatus.fulfilled.match(result)) {
      setStatusNote('');
    } else {
      setActionError(result.payload?.message || 'Failed to update status');
    }
  };

  const handleAssign = async () => {
    if (!assignValue) return;
    setActionError(null);
    setAssignSaving(true);
    const result = await dispatch(
      assignTicket({ id, payload: { assignedTo: assignValue } })
    );
    setAssignSaving(false);
    if (!assignTicket.fulfilled.match(result)) {
      setActionError(result.payload?.message || 'Failed to assign ticket');
    }
  };

  const handleComment = async (message) => {
    setActionError(null);
    setCommentSaving(true);
    const result = await dispatch(addComment({ id, payload: { message } }));
    setCommentSaving(false);
    if (addComment.fulfilled.match(result)) return true;
    setActionError(result.payload?.message || 'Failed to add comment');
    return false;
  };

  const handleEdit = async (payload) => {
    setEditErrors(null);
    setEditSaving(true);
    const result = await dispatch(updateTicket({ id, payload }));
    setEditSaving(false);
    if (updateTicket.fulfilled.match(result)) {
      setEditing(false);
    } else {
      setEditErrors(result.payload?.fieldErrors || null);
      if (!result.payload?.fieldErrors) {
        setActionError(result.payload?.message || 'Failed to update ticket');
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteTicket(id));
    setDeleting(false);
    setConfirmDelete(false);
    if (deleteTicket.fulfilled.match(result)) {
      navigate(-1);
    } else {
      setActionError(result.payload?.message || 'Failed to delete ticket');
    }
  };

  const comments = current.comments || [];
  const history = current.statusHistory || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-gray-400">{current.ticketNumber}</p>
          <h1 className="text-2xl font-semibold text-gray-900">{current.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge value={current.status} map={STATUS_BADGE} />
            <Badge value={current.priority} map={PRIORITY_BADGE} />
            <span className="text-sm text-gray-500">{current.category}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {canEditTicket(user, current) && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
          {canDeleteTicket(user) && (
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Meta + description */}
      <Card>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-gray-500">Created by</dt>
            <dd className="font-medium text-gray-900">
              {current.createdBy?.name || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Assigned to</dt>
            <dd className="font-medium text-gray-900">
              {current.assignedTo?.name || (
                <span className="text-gray-400">Unassigned</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-700">{formatDateTime(current.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Updated</dt>
            <dd className="text-gray-700">{formatDateTime(current.updatedAt)}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t pt-4">
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {current.description}
          </p>
        </div>
      </Card>

      {/* Management controls */}
      {(canUpdateStatus(user, current) || canAssignTicket(user)) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {canUpdateStatus(user, current) && (
            <Card title="Update status">
              <div className="space-y-3">
                <SelectField
                  name="status"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  options={TICKET_STATUSES}
                />
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional note"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end">
                  <Button onClick={handleStatusUpdate} loading={statusSaving}>
                    Update status
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {canAssignTicket(user) && (
            <Card title="Assign agent">
              <div className="space-y-3">
                <SelectField
                  name="assignedTo"
                  value={assignValue}
                  onChange={(e) => setAssignValue(e.target.value)}
                  options={[
                    { value: '', label: 'Select an agent…' },
                    ...agents.map((a) => ({ value: a.id, label: a.name })),
                  ]}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAssign}
                    loading={assignSaving}
                    disabled={!assignValue}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Comments */}
      <Card title={`Comments (${comments.length})`}>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c._id} className="rounded-md bg-gray-50 px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {c.author?.name || 'Unknown'}
                      {c.author?.role && (
                        <span className="ml-2 text-xs text-gray-400">
                          {c.author.role}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {c.message}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {canCommentTicket(user, current) && (
            <div className="border-t pt-4">
              <CommentForm onSubmit={handleComment} loading={commentSaving} />
            </div>
          )}
        </div>
      </Card>

      {/* Status history */}
      <Card title="Status history">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No history yet.</p>
        ) : (
          <ol className="space-y-2">
            {history
              .slice()
              .reverse()
              .map((h, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge value={h.status} map={STATUS_BADGE} />
                    <span className="text-gray-600">
                      by {h.changedBy?.name || 'Unknown'}
                    </span>
                    {h.note && (
                      <span className="text-gray-400">— {h.note}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(h.changedAt)}
                  </span>
                </li>
              ))}
          </ol>
        )}
      </Card>

      {/* Edit modal */}
      <Modal open={editing} title="Edit Ticket" onClose={() => setEditing(false)}>
        <TicketForm
          mode="edit"
          initialValues={{
            title: current.title,
            description: current.description,
            category: current.category,
            priority: current.priority,
          }}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
          loading={editSaving}
          serverErrors={editErrors}
        />
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete ticket"
        message={`Delete ticket ${current.ticketNumber}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default TicketDetailsPage;
