export function EmptyState({ 
  title, 
  message, 
  icon = 'folder_off', 
  action,
  variant = 'default'
}) {
  const variants = {
    default: {
      container: 'bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-600',
      iconBg: 'bg-gray-50 dark:bg-[#223628]',
      iconColor: 'text-gray-400 dark:text-gray-500',
    },
    error: {
      container: 'bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] relative overflow-hidden',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-500',
      overlay: true,
    },
    search: {
      container: 'bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30]',
      iconBg: '',
      iconColor: 'text-gray-300 dark:text-gray-600',
    },
  };

  const config = variants[variant] || variants.default;

  return (
    <div className={`${config.container} p-8 flex flex-col items-center justify-center text-center h-64`}>
      {config.overlay && (
        <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/5 backdrop-blur-[1px]"></div>
      )}
      <div className="relative z-10 flex flex-col items-center">
        {variant === 'search' ? (
          <span className={`material-symbols-outlined ${config.iconColor} text-[48px] mb-2`}>
            {icon}
          </span>
        ) : (
          <div className={`${config.iconBg} p-3 rounded-full mb-4`}>
            <span className={`material-symbols-outlined ${config.iconColor} text-[32px]`}>
              {icon}
            </span>
          </div>
        )}
        <h4 className="text-base font-semibold text-text-main dark:text-white">{title}</h4>
        {message && (
          <p className="text-sm text-text-secondary mt-1 mb-4">{message}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className={
              variant === 'error'
                ? 'mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors'
                : 'text-sm font-medium text-primary hover:underline'
            }
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
