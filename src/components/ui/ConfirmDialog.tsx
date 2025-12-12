'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback when the confirm action is triggered */
  onConfirm: () => void;
  /** Title of the dialog */
  title: string;
  /** Description text shown below the title */
  description?: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Visual variant for the confirm button */
  variant?: 'danger' | 'default';
}

/**
 * A confirmation dialog built on top of Modal.
 * Provides a consistent confirmation pattern with danger and default variants.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete item?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      {description && (
        <p className="mb-6 text-sm text-text-secondary">{description}</p>
      )}
      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={handleConfirm}
          className={
            variant === 'danger'
              ? 'bg-error text-white hover:bg-error/90'
              : 'bg-brand text-white hover:bg-brand-hover'
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
