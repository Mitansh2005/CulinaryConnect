export function ProfileSkeleton() {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-8 p-4 sm:px-6 lg:px-8 lg:py-8 bg-background-light dark:bg-background-dark">
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
        <div className="h-full bg-primary w-1/3 animate-loading-bar"></div>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="h-32 w-full skeleton-shimmer"></div>
        
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-xl border-4 border-white skeleton-shimmer dark:border-gray-800"></div>
          
          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <div className="h-8 w-48 skeleton-shimmer rounded"></div>
                <div className="h-5 w-32 skeleton-shimmer rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-9 w-32 skeleton-shimmer rounded-lg"></div>
                <div className="h-9 w-28 skeleton-shimmer rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {[1, 2].map((i) => (
            <section key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="h-6 w-40 skeleton-shimmer rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full skeleton-shimmer rounded"></div>
                <div className="h-4 w-5/6 skeleton-shimmer rounded"></div>
                <div className="h-4 w-4/6 skeleton-shimmer rounded"></div>
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          {[1, 2].map((i) => (
            <section key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="h-6 w-32 skeleton-shimmer rounded mb-4"></div>
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg skeleton-shimmer"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 skeleton-shimmer rounded"></div>
                      <div className="h-4 w-32 skeleton-shimmer rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
