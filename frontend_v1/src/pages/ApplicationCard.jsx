/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { JobSeekerProfileCard } from "@/components/ui/custom/ApplicantResume";
import { StatusPill } from "@/components/ui/custom/enterprise-shell";
import apiClient from "@/api/apiClient";
import {
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  CalendarDays,
  Loader2,
  User,
} from "lucide-react";

function getStatusTone(status) {
  if (status === "a") return "success";
  if (status === "r") return "danger";
  if (status === "h") return "success";
  return "warning";
}
function getStatusLabel(status) {
  if (status === "a") return "Accepted";
  if (status === "r") return "Rejected";
  if (status === "h") return "Hired";
  return "Pending";
}

function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-sm font-bold text-primary dark:bg-primary/20 dark:text-amber-300">
      {initials}
    </div>
  );
}

export const ApplicationCard = ({ application }) => {
  const { job, applicant, application_date } = application;
  const user = applicant.user;

  const [currentStatus, setCurrentStatus] = useState(application.status);
  const [actioning, setActioning] = useState(null); // "a" | "r" | null
  const [loadingResume, setLoadingResume] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const jobLocation = [job.location?.city, job.location?.state]
    .filter(Boolean)
    .join(", ");

  const formattedDate = application_date
    ? new Date(application_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const handleAction = async (status) => {
    const applicationId = application.application_id;
    if (!applicationId || currentStatus !== "p") return;
    try {
      setActioning(status);
      await apiClient.patch(`/application/hire/${applicationId}/`, { status });
      setCurrentStatus(status);
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setActioning(null);
    }
  };

  const handleViewResume = async () => {
    try {
      setLoadingResume(true);
      const res = await apiClient.get(`/jobseeker/${user.user_id}/`);
      setSelectedProfile(res.data);
      setShowProfile(true);
    } catch (e) {
      console.error("Error fetching resume data:", e);
    } finally {
      setLoadingResume(false);
    }
  };

  const isPending = currentStatus === "p";

  return (
    <>
      <motion.div
        layout
        className="
          docket-card group flex flex-col gap-4 rounded-2xl border border-stone-200/70
          bg-[#fdf8f3] p-4 shadow-sm transition-all duration-200
          hover:border-primary/25 hover:shadow-md
          dark:border-white/[0.07] dark:bg-[#221d18]
          dark:hover:border-primary/20
        "
      >
        {/* Top row — avatar + info + status */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleViewResume}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleViewResume();
            }
          }}
          className="group/applicant flex cursor-pointer items-start gap-3 rounded-xl p-1 -m-1 transition-colors hover:bg-primary/[0.04] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          title="Click to view candidate profile & resume"
        >
          <Avatar name={user.username} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold leading-tight text-text-main-light transition-colors group-hover/applicant:text-primary dark:text-text-main-dark">
                  {user.username}
                </p>
                <p className="mt-0.5 truncate text-xs text-text-sub-light dark:text-text-sub-dark">
                  {user.email}
                </p>
              </div>
              <StatusPill tone={getStatusTone(currentStatus)}>
                {getStatusLabel(currentStatus)}
              </StatusPill>
            </div>

            {/* Meta row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-sub-light dark:text-text-sub-dark">
              {jobLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
                  {jobLocation}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 shrink-0 text-primary/70" />
                Applied {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200/70 dark:bg-white/[0.06]" />

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Accept */}
          <button
            onClick={() => handleAction("a")}
            disabled={!isPending || actioning !== null}
            className={`
              flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold
              transition-all duration-150
              ${
                !isPending
                  ? "cursor-not-allowed border-stone-200 text-stone-400 opacity-60 dark:border-white/10 dark:text-white/30"
                  : actioning === "a"
                  ? "border-forest-400 bg-forest-500/10 text-forest-600 dark:border-forest-400 dark:text-forest-300"
                  : "border-forest-500/60 text-forest-700 hover:bg-forest-500 hover:border-forest-500 hover:text-white dark:border-forest-400/50 dark:text-forest-300 dark:hover:bg-forest-500 dark:hover:text-[#0d1f16]"
              }
            `}
          >
            {actioning === "a" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5" />
            )}
            {currentStatus === "a" ? "Accepted" : "Accept"}
          </button>

          {/* Reject */}
          <button
            onClick={() => handleAction("r")}
            disabled={!isPending || actioning !== null}
            className={`
              flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold
              transition-all duration-150
              ${
                !isPending
                  ? "cursor-not-allowed border-stone-200 text-stone-400 opacity-60 dark:border-white/10 dark:text-white/30"
                  : actioning === "r"
                  ? "border-rose-400 bg-rose-500/10 text-rose-600 dark:border-rose-400 dark:text-rose-300"
                  : "border-rose-500/60 text-rose-700 hover:bg-rose-500 hover:border-rose-500 hover:text-white dark:border-rose-400/50 dark:text-rose-300 dark:hover:bg-rose-500 dark:hover:text-white"
              }
            `}
          >
            {actioning === "r" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {currentStatus === "r" ? "Rejected" : "Reject"}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View resume */}
          <button
            onClick={handleViewResume}
            disabled={loadingResume}
            className="flex items-center gap-1.5 rounded-xl border border-stone-300/70 px-3 py-1.5 text-xs font-semibold text-text-sub-light transition hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-text-sub-dark dark:hover:border-primary/30 dark:hover:text-amber-300"
          >
            {loadingResume ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            Resume
          </button>

          {/* Message */}
          <Link
            to={`/messages?uid=${user.uid}`}
            className="flex items-center gap-1.5 rounded-xl border border-primary/50 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground dark:border-primary/40 dark:bg-primary/10 dark:text-amber-300 dark:hover:bg-primary dark:hover:text-[#1a0e00]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </Link>
        </div>
      </motion.div>

      {/* Resume overlay */}
      <AnimatePresence>
        {showProfile && selectedProfile && (
          <motion.div
            key="resume-overlay"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            />
            {/* Panel */}
            <motion.div
              className="relative z-[201] w-full max-w-3xl overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/60 bg-[#fdf8f3] shadow-2xl dark:border-white/10 dark:bg-[#1e1a15]"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-stone-200/60 px-4 py-3 sm:px-6 sm:py-4 dark:border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                    {user.username}'s profile
                  </span>
                </div>
                <button
                  onClick={() => setShowProfile(false)}
                  aria-label="Close profile modal"
                  className="flex h-8 w-8 items-center justify-center rounded-[10px] text-text-sub-light transition-[border-radius,background-color,color,transform] duration-200 hover:rounded-[6px] hover:bg-rose-50 hover:text-rose-500 active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-text-sub-dark dark:hover:bg-rose-500/12 dark:hover:text-rose-300"
                >
                  <span aria-hidden="true" className="text-base leading-none">✕</span>
                </button>
              </div>
              {/* Content */}
              <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">
                <JobSeekerProfileCard profile={selectedProfile} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
