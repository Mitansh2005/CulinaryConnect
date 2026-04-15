import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { SurfaceCard, SectionHeading } from "@/components/ui/custom/enterprise-shell";

export const ApplicationGroup = ({ jobTitle, applications }) => {
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const totalPages = Math.ceil(applications.length / pageSize);
  const visible = applications.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <SurfaceCard className="p-5 sm:p-6">
      <SectionHeading
        eyebrow={`${applications.length} applicant${applications.length !== 1 ? "s" : ""}`}
        title={jobTitle}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((app) => (
          <ApplicationCard key={app.application_id} application={app} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-text-sub-light transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/8 dark:text-text-sub-dark"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-text-sub-light dark:text-text-sub-dark">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-text-sub-light transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/8 dark:text-text-sub-dark"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </SurfaceCard>
  );
};
