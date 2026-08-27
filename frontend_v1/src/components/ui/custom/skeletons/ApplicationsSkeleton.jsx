export function ApplicationsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark p-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
        <div className="h-full bg-primary w-1/3 animate-loading-bar"></div>
      </div>

      <div className="mb-6 space-y-2">
        <div className="h-8 w-48 skeleton-shimmer rounded-lg"></div>
        <div className="h-4 w-96 skeleton-shimmer rounded"></div>
      </div>

      <div className="border-b border-border-light dark:border-border-dark flex gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-3">
            <div className="h-5 w-20 skeleton-shimmer rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
            <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg skeleton-shimmer flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 w-1/3 skeleton-shimmer rounded"></div>
                <div className="h-4 w-1/4 skeleton-shimmer rounded"></div>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 w-16 skeleton-shimmer rounded"></div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 w-24 skeleton-shimmer rounded-full"></div>
                <div className="h-4 w-16 skeleton-shimmer rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
