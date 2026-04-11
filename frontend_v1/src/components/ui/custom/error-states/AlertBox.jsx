export function AlertBox({ type = 'error', title, message, list, onDismiss }) {
  const configs = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-900/30',
      icon: 'cancel',
      iconColor: 'text-red-400',
      titleColor: 'text-red-800 dark:text-red-200',
      messageColor: 'text-red-700 dark:text-red-300',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-900/30',
      icon: 'warning',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800 dark:text-yellow-200',
      messageColor: 'text-yellow-700 dark:text-yellow-300',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-900/30',
      icon: 'info',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-800 dark:text-blue-200',
      messageColor: 'text-blue-700 dark:text-blue-300',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-900/30',
      icon: 'check_circle',
      iconColor: 'text-green-400',
      titleColor: 'text-green-800 dark:text-green-200',
      messageColor: 'text-green-700 dark:text-green-300',
    },
  };

  const config = configs[type];

  return (
    <div className={`rounded-md ${config.bg} p-4 border ${config.border}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={`material-symbols-outlined ${config.iconColor} text-[20px]`}>
            {config.icon}
          </span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>{title}</h3>
          )}
          {message && (
            <div className={`${title ? 'mt-2' : ''} text-sm ${config.messageColor}`}>
              <p>{message}</p>
            </div>
          )}
          {list && list.length > 0 && (
            <div className={`${title || message ? 'mt-2' : ''} text-sm ${config.messageColor}`}>
              <ul className="list-disc pl-5 space-y-1" role="list">
                {list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
