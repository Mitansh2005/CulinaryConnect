import { SurfaceCard } from "@/components/ui/custom/enterprise-shell";

export function ApplicantDetailSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      {/* LEFT SIDEBAR */}
      <div className="flex flex-col gap-6">
        <SurfaceCard className="p-5 sm:p-6 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <div className="size-32 rounded-full skeleton-shimmer" />
          </div>
          <div className="h-6 w-3/4 skeleton-shimmer rounded mb-1" />
          <div className="h-4 w-1/2 skeleton-shimmer rounded mb-4" />
          <div className="mb-6 h-8 w-3/4 skeleton-shimmer rounded-full" />
          <div className="grid w-full grid-cols-2 gap-4 border-t border-border-light dark:border-border-dark pt-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-16 skeleton-shimmer rounded mb-2" />
              <div className="h-6 w-12 skeleton-shimmer rounded" />
            </div>
            <div className="flex flex-col items-center border-l border-border-light dark:border-border-dark">
              <div className="h-3 w-12 skeleton-shimmer rounded mb-2" />
              <div className="h-6 w-16 skeleton-shimmer rounded" />
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5 sm:p-6 space-y-4">
          <div className="h-4 w-20 skeleton-shimmer rounded mb-1" />
          <div className="h-6 w-32 skeleton-shimmer rounded mb-4" />
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="size-5 skeleton-shimmer rounded mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 skeleton-shimmer rounded" />
                <div className="h-4 w-full skeleton-shimmer rounded" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-5 skeleton-shimmer rounded mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 skeleton-shimmer rounded" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded" />
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5 sm:p-6">
          <div className="h-4 w-20 skeleton-shimmer rounded mb-1" />
          <div className="h-6 w-32 skeleton-shimmer rounded mb-4" />
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-8 w-24 skeleton-shimmer rounded-full" />
            <div className="h-8 w-32 skeleton-shimmer rounded-full" />
            <div className="h-8 w-20 skeleton-shimmer rounded-full" />
          </div>
        </SurfaceCard>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex flex-col gap-6">
        <SurfaceCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-40 skeleton-shimmer rounded" />
            <div className="h-7 w-24 skeleton-shimmer rounded-full" />
          </div>
          <div className="relative pl-4">
            <div className="absolute bottom-6 left-[27px] top-2 w-0.5 bg-border-light dark:bg-border-dark"></div>
            
            <div className="relative flex gap-6 pb-8">
              <div className="relative z-10 size-6 rounded-full skeleton-shimmer flex-none" />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-1 space-y-2 sm:space-y-0">
                <div className="space-y-2 w-full">
                  <div className="h-4 w-40 skeleton-shimmer rounded" />
                  <div className="h-3 w-3/4 skeleton-shimmer rounded" />
                </div>
                <div className="h-3 w-20 skeleton-shimmer rounded" />
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="relative z-10 size-6 rounded-full skeleton-shimmer flex-none" />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-1 p-3 rounded-lg border border-border-light dark:border-border-dark w-full space-y-2 sm:space-y-0">
                <div className="space-y-2 w-full">
                  <div className="h-4 w-32 skeleton-shimmer rounded" />
                  <div className="h-3 w-1/2 skeleton-shimmer rounded" />
                </div>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5 sm:p-6">
          <div className="h-4 w-20 skeleton-shimmer rounded mb-1" />
          <div className="h-6 w-48 skeleton-shimmer rounded mb-4" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-11/12 skeleton-shimmer rounded" />
            <div className="h-4 w-4/5 skeleton-shimmer rounded" />
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5 sm:p-6">
          <div className="h-4 w-20 skeleton-shimmer rounded mb-1" />
          <div className="h-6 w-48 skeleton-shimmer rounded mb-4" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-5/6 skeleton-shimmer rounded" />
            <div className="h-4 w-2/3 skeleton-shimmer rounded" />
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
