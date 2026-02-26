import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext(null);

const TOAST_DURATION = 4000;

const icons = {
  success: FiCheck,
  error: FiX,
  warning: FiAlertTriangle,
  info: FiInfo
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500'
};

const Toast = ({ toast, onDismiss }) => {
  const Icon = icons[toast.type] || FiInfo;

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-in-right ${colors[toast.type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 text-white/70 hover:text-white transition-colors flex-shrink-0"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), TOAST_DURATION);
  }, [dismiss]);

  const toast = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    warning: (msg) => addToast('warning', msg),
    info: (msg) => addToast('info', msg)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return no-op to avoid crashes when used outside provider
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {}
    };
  }
  return context;
};

export default ToastProvider;
