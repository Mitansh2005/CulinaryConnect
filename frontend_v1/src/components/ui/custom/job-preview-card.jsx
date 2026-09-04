/* eslint-disable react/prop-types */
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Wallet,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, StatusPill, SurfaceCard } from "./enterprise-shell";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useDepthCardMotion } from "@/components/hooks/useCulinaryMotion";

export function JobPreviewCard({
  job,
  accentLabel,
  primaryLabel = "View role",
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  // Save/bookmark props
  isSaved = false,
  onToggleSave,
  saveLoading = false,
  userType,
}) {
  const cardRef = useDepthCardMotion({ disabled: true });

  const isNew = job?.posted_date
    ? Date.now() - new Date(job.posted_date).getTime() < 1000 * 60 * 60 * 24 * 3
    : false;
  const locationLabel =
    job?.location?.city && job?.location?.state
      ? `${job.location.city}, ${job.location.state}`
      : "Location shared after review";
  const deadlineLabel = job?.application_deadline
    ? formatDate(job.application_deadline)
    : null;
  const isUrgent = job?.application_deadline
    ? new Date(job.application_deadline).getTime() - Date.now() <
      1000 * 60 * 60 * 24 * 7
    : false;

  const showSaveButton =
    userType !== "restaurant" && typeof onToggleSave === "function";

  return (
    <div ref={cardRef}>
      <SurfaceCard
        role={onPrimaryAction ? "button" : undefined}
        tabIndex={onPrimaryAction ? 0 : undefined}
        onClick={onPrimaryAction}
        onKeyDown={
          onPrimaryAction
            ? (e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  e.target === e.currentTarget
                ) {
                  e.preventDefault();
                  onPrimaryAction();
                }
              }
            : undefined
        }
        className={cn(
          "docket-card cc-scroll-in flex h-full flex-col gap-5 transition-all duration-200",
          onPrimaryAction &&
            "cursor-pointer hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              className="h-14 w-14 rounded-[1.25rem]"
              icon={Building2}
              name={job?.company_name || "Kitchen"}
              src={job?.company_logo}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.14em] text-text-sub-light dark:text-text-sub-dark">
                {job?.company_name || "Independent kitchen"}
              </p>
              <h3 className="mt-1 text-balance font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                {job?.title || "Open culinary role"}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* ── Bookmark / save button ─────────────────────────── */}
            {showSaveButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave();
                }}
                disabled={saveLoading}
                aria-label={isSaved ? "Remove from saved roles" : "Save this role"}
                title={isSaved ? "Remove from saved" : "Save this role"}
                className={cn(
                  "group flex h-9 w-9 items-center justify-center rounded-[14px] border transition-[border-radius,background-color,border-color,color,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] hover:rounded-[8px] active:scale-[0.93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSaved
                    ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 dark:border-primary/40 dark:bg-primary/20 dark:text-primary"
                    : "border-slate-300 bg-white/70 text-slate-600 hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-white/5 dark:text-slate-400 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary",
                  saveLoading && "opacity-50 cursor-wait",
                )}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
                ) : (
                  <Bookmark className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
                )}
              </button>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              {accentLabel ? (
                <StatusPill tone="info">{accentLabel}</StatusPill>
              ) : null}
              {isNew ? (
                <StatusPill tone="success">Fresh listing</StatusPill>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill tone="location">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {locationLabel}
          </StatusPill>
          <StatusPill tone="salary">
            <Wallet className="mr-1 h-3.5 w-3.5" />
            {formatCurrency(job?.salary)}
          </StatusPill>
          <StatusPill>
            <Clock3 className="mr-1 h-3.5 w-3.5" />
            {job?.employment_type || "Full Time"}
          </StatusPill>
          {deadlineLabel ? (
            <StatusPill tone={isUrgent ? "deadline" : "neutral"}>
              <CalendarDays className="mr-1 h-3.5 w-3.5" />
              Apply by {deadlineLabel}
            </StatusPill>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-text-main-light dark:text-text-main-dark">
          {job?.description
            ? String(job.description)
                .replace(/<[^>]+>/g, " ")
                .slice(0, 180)
                .trim() + "..."
            : "Verified kitchens, clearer expectations, and faster hiring decisions for serious culinary professionals."}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-light/70 pt-4 dark:border-border-dark/70">
          <div className="flex flex-wrap gap-4 text-sm text-text-sub-light dark:text-text-sub-dark">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Posted {formatDate(job?.posted_date)}
            </span>
            {deadlineLabel ? (
              <span className="inline-flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Apply by {deadlineLabel}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {secondaryLabel && onSecondaryAction ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSecondaryAction(e);
                }}
                type="button"
                variant="outline"
              >
                {secondaryLabel}
              </Button>
            ) : null}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPrimaryAction?.(e);
              }}
              type="button"
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
