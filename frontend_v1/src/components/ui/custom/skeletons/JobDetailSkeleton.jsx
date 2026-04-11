export function JobDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark p-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
        <div className="h-full bg-primary w-1/3 animate-loading-bar"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="h-8 w-24 skeleton-shimmer rounded mb-6"></div>

        <div className="rounded-xl border border-border-light bg-surface-light p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <div className="flex items-start gap-6 mb-6">
            <div className="h-20 w-20 rounded-lg skeleton-shimmer flex-shrink-0"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 w-2/3 skeleton-shimmer rounded"></div>
              <div className="h-5 w-1/3 skeleton-shimmer rounded"></div>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-20 skeleton-shimmer rounded"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-6">
            <div className="space-y-3">
              <div className="h-6 w-32 skeleton-shimmer rounded"></div>
              <div className="h-4 w-full skeleton-shimmer rounded"></div>
              <div className="h-4 w-5/6 skeleton-shimmer rounded"></div>
              <div className="h-4 w-4/6 skeleton-shimmer rounded"></div>
            </div>

            <div className="space-y-3">
              <div className="h-6 w-40 skeleton-shimmer rounded"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-3/4 skeleton-shimmer rounded"></div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-light dark:border-border-dark pt-6 mt-6 flex gap-4">
            <div className="h-12 w-32 skeleton-shimmer rounded-lg"></div>
            <div className="h-12 w-32 skeleton-shimmer rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
