import { useEffect } from 'react';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';

/**
 * Modern confirmation dialog.
 *
 * Props:
 *   isOpen       boolean
 *   title        string
 *   message      string
 *   confirmLabel string  (default "Delete")
 *   variant      "danger" | "warning"  (default "danger")
 *   onConfirm    () => void
 *   onCancel     () => void
 */
const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  const iconBg    = isDanger ? 'bg-red-100'    : 'bg-amber-100';
  const iconColor = isDanger ? 'text-red-600'  : 'text-amber-600';
  const btnBg     = isDanger
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400';

  const Icon = isDanger ? FiTrash2 : FiAlertTriangle;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5 animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Icon + Text */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
          <div>
            <h3 id="confirm-title" className="text-lg font-bold text-gray-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${btnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
