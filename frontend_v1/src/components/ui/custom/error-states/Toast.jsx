import { useEffect } from 'react';

export function Toast({ type = 'error', title, message, onClose, action, autoClose = true }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const configs = {
    error: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-red-100 dark:border-red-900/30 border-l-red-500',
      icon: 'error',
      iconColor: 'text-red-500',
      titleColor: 'text-gray-900 dark:text-white',
      messageColor: 'text-gray-600 dark:text-gray-400',
      actionColor: 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
    },
    warning: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-yellow-100 dark:border-yellow-900/30 border-l-yellow-500',
      icon: 'warning',
      iconColor: 'text-yellow-500',
      titleColor: 'text-gray-900 dark:text-white',
      messageColor: 'text-gray-600 dark:text-gray-400',
      actionColor: 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300',
    },
    success: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-green-100 dark:border-green-900/30 border-l-green-500',
      icon: 'check_circle',
      iconColor: 'text-green-500',
      titleColor: 'text-gray-900 dark:text-white',
      messageColor: 'text-gray-600 dark:text-gray-400',
      actionColor: 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300',
    },
    info: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-blue-100 dark:border-blue-900/30 border-l-blue-500',
      icon: 'info',
      iconColor: 'text-blue-500',
      titleColor: 'text-gray-900 dark:text-white',
      messageColor: 'text-gray-600 dark:text-gray-400',
      actionColor: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
    },
  };

  const config = configs[type];

  return (
    <div className={`transform transition-all duration-300 translate-y-0 opacity-100 ${config.bg} border ${config.border} shadow-lg rounded-lg p-4 flex items-start gap-3 border-l-4`}>
      <div className={`flex-shrink-0 ${config.iconColor} mt-0.5`}>
        <span className="material-symbols-outlined filled">{config.icon}</span>
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-bold ${config.titleColor}`}>{title}</h4>
        {message && <p className={`text-sm ${config.messageColor} mt-1`}>{message}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className={`text-sm font-semibold ${config.actionColor} mt-2`}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
