export function InlineError({ message, id }) {
  if (!message) return null;

  return (
    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" id={id}>
      {message}
    </p>
  );
}

export function InputWithError({ 
  label, 
  id, 
  error, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  className = '',
  ...props 
}) {
  const hasError = !!error;

  return (
    <div className={className}>
      {label && (
        <label 
          className="block text-sm font-medium text-text-main dark:text-white mb-1" 
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-describedby={hasError ? `${id}-error` : undefined}
          aria-invalid={hasError}
          className={`block w-full rounded-lg ${
            hasError
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-200 dark:border-red-800'
              : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary bg-white dark:bg-gray-800'
          } text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 sm:text-sm pr-10`}
          {...props}
        />
        {hasError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
          </div>
        )}
      </div>
      <InlineError message={error} id={`${id}-error`} />
    </div>
  );
}

export function SelectWithError({ 
  label, 
  id, 
  error, 
  value, 
  onChange, 
  children,
  className = '',
  ...props 
}) {
  const hasError = !!error;

  return (
    <div className={className}>
      {label && (
        <label 
          className="block text-sm font-medium text-text-main dark:text-white mb-1" 
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-lg ${
          hasError
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-200 dark:border-red-800'
            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary bg-white dark:bg-gray-800'
        } text-gray-900 dark:text-white sm:text-sm`}
        {...props}
      >
        {children}
      </select>
      <InlineError message={error} id={`${id}-error`} />
    </div>
  );
}
