/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImLocation } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { JobSeekerProfileCard } from "@/components/ui/custom/ApplicantResume";
import { getFreshIdToken } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import { StatusPill } from "@/components/ui/custom/enterprise-shell";
import apiClient from "@/api/apiClient";
import { MessageSquare, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export const ApplicationCard = ({ application }) => {
  const { job, applicant, application_date } = application;
  const user = applicant.user;
  const navigate = useNavigate();

  const [currentStatus, setCurrentStatus] = useState(application.status);
  const [actioning, setActioning] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const jobLocation = `${job.location?.city || ""}, ${job.location?.state || ""}`;

  const handleAction = async (status) => {
    const applicationId = application.application_id;
    if (!applicationId || currentStatus !== "p") return;
    try {
      setActioning(true);
      await apiClient.patch(`/application/hire/${applicationId}/`, { status });
      setCurrentStatus(status);
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setActioning(false);
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
      <div className="flex flex-col gap-5 rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-white/10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-text-main-light dark:text-text-main-dark">
              {user.username}
            </p>
            <p className="mt-0.5 text-sm text-text-sub-light dark:text-text-sub-dark">
              {user.email}
            </p>
            <p className="mt-0.5 text-sm text-text-sub-light dark:text-text-sub-dark">
              {job.title} @ {job.company_name}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-text-sub-light/80 dark:text-text-sub-dark/80">
              <ImLocation className="h-3 w-3 shrink-0" />
              {jobLocation}
            </div>
          </div>
          <StatusPill tone={getStatusTone(currentStatus)}>
            {getStatusLabel(currentStatus)}
          </StatusPill>
        </div>

        <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
          Applied:{" "}
          {application_date
            ? new Date(application_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : application_date}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAction("a")}
            disabled={!isPending || actioning}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-1.5 text-sm font-medium transition ${
              !isPending
                ? "cursor-not-allowed border-border-light text-text-sub-light dark:border-border-dark dark:text-text-sub-dark opacity-50"
                : "border-forest-500 text-forest-700 hover:bg-forest-500 hover:text-white dark:border-forest-400 dark:text-forest-200 dark:hover:bg-forest-500 dark:hover:text-[#102216]"
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {actioning ? "Updating…" : currentStatus === "a" ? "Accepted" : "Accept"}
          </button>

          <button
            onClick={() => handleAction("r")}
            disabled={!isPending || actioning}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-1.5 text-sm font-medium transition ${
              !isPending
                ? "cursor-not-allowed border-border-light text-text-sub-light dark:border-border-dark dark:text-text-sub-dark opacity-50"
                : "border-rose-500 text-rose-700 hover:bg-rose-500 hover:text-white dark:border-rose-400 dark:text-rose-200 dark:hover:bg-rose-500 dark:hover:text-white"
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            {actioning ? "Updating…" : currentStatus === "r" ? "Rejected" : "Reject"}
          </button>

          <Link
            to={`/messages?uid=${user.uid}`}
            className="flex items-center gap-1.5 rounded-xl border border-primary px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground dark:border-primary"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </Link>

          <button
            onClick={handleViewResume}
            disabled={loadingResume}
            className="flex items-center gap-1.5 rounded-xl border border-secondary px-4 py-1.5 text-sm font-medium text-secondary transition hover:bg-secondary hover:text-secondary-foreground dark:border-secondary dark:text-secondary"
          >
            <Eye className="h-3.5 w-3.5" />
            {loadingResume ? "Loading…" : "View resume"}
          </button>
        </div>
      </div>

      {/* Resume overlay */}
      <AnimatePresence>
        {showProfile && selectedProfile && (
          <motion.div
            key="resume-overlay"
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              className="glass-panel relative z-[101] w-[90%] max-w-4xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setShowProfile(false)}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-text-sub-light transition hover:bg-rose-50 hover:text-rose-500 dark:text-text-sub-dark dark:hover:bg-rose-500/12 dark:hover:text-rose-300"
              >
                ✕
              </button>
              <JobSeekerProfileCard profile={selectedProfile} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
