/* eslint-disable react/prop-types */
import { ArrowRight, Building2, CalendarDays, Clock3, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, StatusPill, SurfaceCard } from "./enterprise-shell";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function JobPreviewCard({
  job,
  accentLabel,
  primaryLabel = "View role",
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
}) {
  const isNew = job?.posted_date
    ? Date.now() - new Date(job.posted_date).getTime() < 1000 * 60 * 60 * 24 * 3
    : false;
  const locationLabel =
    job?.location?.city && job?.location?.state
      ? `${job.location.city}, ${job.location.state}`
      : "Location shared after review";
  const deadlineLabel = job?.application_deadline ? formatDate(job.application_deadline) : null;
  const isUrgent = job?.application_deadline
    ? new Date(job.application_deadline).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7
    : false;

  return (
    <SurfaceCard className="flex h-full flex-col gap-5">
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
        <div className="flex flex-wrap justify-end gap-2">
          {accentLabel ? <StatusPill tone="info">{accentLabel}</StatusPill> : null}
          {isNew ? <StatusPill tone="success">Fresh listing</StatusPill> : null}
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

      <p className="text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
        {job?.description
          ? String(job.description).replace(/<[^>]+>/g, " ").slice(0, 180).trim() + "..."
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
            <Button onClick={onSecondaryAction} type="button" variant="outline">
              {secondaryLabel}
            </Button>
          ) : null}
          <Button onClick={onPrimaryAction} type="button">
            {primaryLabel}
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
