export function FullPageError({ 
  title = 'Something went wrong in the kitchen',
  message = "We couldn't load the page you were looking for. The recipe might have been changed or the page doesn't exist anymore.",
  errorCode,
  sessionId,
  onRetry,
  onGoBack,
  icon = 'soup_kitchen'
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
      <div className="size-48 bg-gray-50 dark:bg-[#223628] rounded-full flex items-center justify-center mb-8 relative">
        <div className="relative z-10">
          <span className="material-symbols-outlined text-gray-300 dark:text-gray-500 text-[100px]">
            {icon}
          </span>
          <div className="absolute -right-2 -bottom-2 bg-white dark:bg-surface-dark rounded-full p-1">
            <span className="material-symbols-outlined text-red-500 text-[40px] filled">error</span>
          </div>
        </div>
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-200 rounded-full opacity-60"></div>
        <div className="absolute bottom-10 right-10 w-6 h-6 bg-green-200 rounded-full opacity-60"></div>
        <div className="absolute top-8 right-12 w-3 h-3 bg-red-200 rounded-full opacity-60"></div>
      </div>
      
      <h3 className="text-2xl font-bold text-text-main dark:text-white mb-3">{title}</h3>
      <p className="text-text-secondary max-w-md mx-auto mb-8 text-base">{message}</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-[#003310] font-bold shadow-md transition-all transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            <span>Try Again</span>
          </button>
        )}
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-border-color dark:border-[#35483b] text-text-main dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-[#35483b] transition-colors"
          >
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>
      
      {(errorCode || sessionId) && (
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 w-full max-w-xs">
          {errorCode && <p className="text-xs text-text-secondary">Error Code: {errorCode}</p>}
          {sessionId && <p className="text-xs text-text-secondary mt-1">Session ID: {sessionId}</p>}
        </div>
      )}
    </div>
  );
}
