import { SurfaceCard } from "@/components/ui/custom/enterprise-shell";

export function JobDetailSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-6">
        {/* Header Card */}
        <SurfaceCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[1.35rem] skeleton-shimmer flex-shrink-0" />
              <div className="space-y-3 w-full">
                <div className="h-4 w-24 skeleton-shimmer rounded" />
                <div className="h-8 w-48 sm:w-64 skeleton-shimmer rounded" />
                <div className="h-4 w-40 skeleton-shimmer rounded" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
              <div className="h-8 w-20 skeleton-shimmer rounded-full" />
              <div className="h-8 w-24 skeleton-shimmer rounded-full" />
            </div>
          </div>
        </SurfaceCard>

        {/* Role overview */}
        <SurfaceCard className="p-5 sm:p-6 space-y-4">
          <div className="h-8 w-40 skeleton-shimmer rounded" />
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-5/6 skeleton-shimmer rounded" />
            <div className="h-4 w-4/6 skeleton-shimmer rounded" />
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          </div>
        </SurfaceCard>

        {/* Requirements */}
        <SurfaceCard className="p-5 sm:p-6 space-y-4">
          <div className="h-8 w-40 skeleton-shimmer rounded" />
          <div className="space-y-3 pt-2">
            <div className="h-4 w-11/12 skeleton-shimmer rounded" />
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-5/6 skeleton-shimmer rounded" />
            <div className="h-4 w-4/6 skeleton-shimmer rounded" />
          </div>
        </SurfaceCard>

        {/* About the company */}
        <SurfaceCard className="p-5 sm:p-6 space-y-4">
          <div className="h-8 w-48 skeleton-shimmer rounded" />
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-5/6 skeleton-shimmer rounded" />
            <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 h-fit">
        {/* Quick facts */}
        <SurfaceCard className="p-5 sm:p-6">
          <div className="h-8 w-32 skeleton-shimmer rounded mb-5" />
          <div className="grid gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-[1.35rem] border border-border-light/60 bg-white/50 p-4 dark:border-border-dark/60 dark:bg-white/5"
              >
                <div className="h-3 w-20 skeleton-shimmer rounded mb-3" />
                <div className="h-5 w-32 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
