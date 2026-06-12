import Modal from './Modal';
import Button from './Button';

// Reusable confirmation dialog built on Modal.
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} title={title} onClose={onCancel}>
    <p className="text-sm text-gray-600">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        type="button"
        variant={confirmVariant}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
