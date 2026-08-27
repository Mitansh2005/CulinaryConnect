/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import {
  StatusPill,
  EmptyPanel,
} from "@/components/ui/custom/enterprise-shell";
import { Button } from "@/components/ui/button";

// Status helpers consistent with the rest of the app
function getStatusTone(status) {
  if (status === "a" || status === "h") return "success";
  if (status === "r") return "danger";
  return "warning";
}
function getStatusLabel(status) {
  if (status === "a") return "Accepted";
  if (status === "h") return "Hired";
  if (status === "r") return "Rejected";
  return "Pending";
}

/* ─── Chef: list of their own applications ─────────────────────────────── */
export const ApplicantApplications = ({ applications }) => {
  const navigate = useNavigate();

  if (!applications || applications.length === 0) {
    return (
      <EmptyPanel
        className="cc-scroll-in min-h-[280px]"
        title="No applications yet"
        description="Browse the job feed and apply to roles that match your skills."
        action={
          <Button onClick={() => navigate("/home")} type="button">
            Browse open roles
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {applications.map((app) => {
        const job = app.job;
        const status = app.status;
        const tone = getStatusTone(status);
        const label = getStatusLabel(status);

        return (
          <div
            key={app.application_id}
            className="cc-scroll-in flex flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-white/10"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
                  {job.title}
                </p>
                <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                  {job.company_name}
                </p>
                <p className="mt-0.5 text-xs text-text-sub-light/80 dark:text-text-sub-dark/80">
                  {job.location?.city}, {job.location?.state}
                </p>
              </div>
              <button
                onClick={() => navigate(`/job/${job.job_id}`)}
                className="mt-0.5 rounded-lg p-1.5 text-text-sub-light transition hover:text-primary dark:text-text-sub-dark"
                title="View job posting"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <StatusPill tone={tone}>{label}</StatusPill>
              {status === "r" && (
                <span className="text-xs text-rose-500 dark:text-rose-300">
                  Not shortlisted
                </span>
              )}
              {status === "a" && (
                <span className="text-xs text-forest-600 dark:text-forest-300">
                  You&apos;ve been selected
                </span>
              )}
              {status === "p" && (
                <span className="text-xs text-amber-600 dark:text-amber-300">
                  Under review
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
