/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useJobDetails } from "@/api/jobs-data";

import { useState } from "react";
import { applyForJob } from "@/api/apply-for-job";
import Spinner from "./spinner";
import { getUid } from "@/firebase/authUtils";
import DOMpurify from "dompurify";
import { useUser } from "@/contexts/UserContext";
export const DetailJobCard = ({ job, onClose }) => {
  const uid = getUid();
  const { userData } = useUser();
  const userType = userData?.user_type;
  console.log("DetailJobCard received job:", job);
  console.log("Job ID:", job?.id, "Job job_id:", job?.job_id);
  const { data, isLoading, isFetching, isPending, isError } = useJobDetails(
    job.job_id,
  );
  const [isApplicationSuccessful, setIsApplicationSuccessful] = useState(false);
  const [isApplicationFailed, setIsApplicationFailed] = useState(false);
  const [isApplicationLoading, setIsApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  let daysRemaining = 0;
  if (data) {
    const deadline = new Date(data.application_deadline);
    const now = new Date();
    const timeDiff = deadline - now;
    daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  const handleApplySubmit = async (jobId) => {
    const application = {
      job: jobId,
      applicant_uid: uid,
      application_date: new Date().toISOString().split("T")[0],
    };

    setIsApplicationLoading(true);
    setApplicationError("");
    setIsApplicationSuccessful(false);
    setIsApplicationFailed(false);

    try {
      await applyForJob(application);
      setIsApplicationSuccessful(true);
    } catch (err) {
      console.error("Application failed:", err);
      setIsApplicationFailed(true);

      // DRF validation errors usually come as an array: ["You have already applied..."]
      if (Array.isArray(err) && err.length > 0) {
        setApplicationError(err[0]);
      } else if (err.message) {
        setApplicationError(err.message);
      } else if (typeof err === "string") {
        setApplicationError(err);
      } else {
        setApplicationError("Something went wrong. Please try again.");
      }

      // Show temporary popup
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
        // Reset the failed state so the user can try again if they want
        setIsApplicationFailed(false);
      }, 5000);
    } finally {
      setIsApplicationLoading(false);
    }
  };

  const sanitizedHtml = (html) => {
    return DOMpurify.sanitize(html, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "p",
        "br",
        "ul",
        "ol",
        "li",
      ],
      ALLOWED_ATTR: ["href"],
    });
  };
  const isTallContent = (data) => {
    // crude example: if description or requirements are long
    return (
      (data?.description?.length ?? 0) > 600 ||
      (data?.requirements?.length ?? 0) > 600 ||
      (data?.company_description?.length ?? 0) > 600
    );
  };

  return (
    <>
      <AnimatePresence>
        {showErrorPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-white/95 dark:bg-card-dark/95 backdrop-blur-md border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-medium text-sm rounded-2xl shadow-xl shadow-rose-900/5"
          >
            <XCircle className="w-5 h-5" />
            {applicationError}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center overflow-auto "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layoutId={`job-${job.job_id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8 w-[90%] h-fit max-w-4xl relative overflow-auto"
            style={{
              maxHeight: "calc(100vh - 4rem)",
              overflowY: data && isTallContent(data) ? "auto" : "visible",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
            {isLoading || isFetching || isPending ? (
              <>
                <div className="flex items-center justify-center h-64 bg-[#FBFEF9] ml-30">
                  <Spinner />
                  <p className="ml-4 font-semibold text-2xl text-[#0C6291]">
                    Loading the job details in a second...
                  </p>
                </div>
              </>
            ) : isError || !data ? (
              <div className="flex items-center justify-center h-64">
                <p className="font-semibold text-lg text-rose-600">
                  Could not load job details right now.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <img
                    loading="lazy"
                    src={`data:image/jpeg;base64,${job.company_logo?.replace(/\s/g, "")}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name || "Company")}&background=F3E9DC&color=5E3023`;
                    }}
                    alt="Company Logo"
                    className="h-14 w-14 object-cover  rounded-full"
                  />
                  <h1 className="ml-4 text-3xl font-semibold">
                    {data.company_name}
                  </h1>
                </div>
                <h1 className="text-2xl font-semibold mt-4">{data.title}</h1>
                <p className="my-4 text-gray-600 dark:text-gray-300">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: sanitizedHtml(data.description),
                    }}
                  />
                </p>
                <p
                  className="my-4 font-semibold text-text-main-light dark:text-text-main-dark"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedHtml(data.requirements),
                  }}
                ></p>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Location :{" "}
                  </span>
                  <span className="font-semibold text-brandBackground dark:text-primary">
                    {data.location.city}, {data.location.state},{" "}
                    {data.location.country}, {data.location.postal_code}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Salary :{" "}
                  </span>
                  <span className="text-green-700 dark:text-green-400">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(data.salary)}
                    / year
                  </span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Application deadline :{" "}
                    </span>
                    <span className="font-semibold text-red-700 dark:text-red-400">
                      {data.application_deadline} ({daysRemaining} days left);
                    </span>
                  </div>
                  {userType !== "restaurant" && (
                    <button
                      onClick={() => handleApplySubmit(job.job_id)}
                      disabled={isApplicationLoading || isApplicationSuccessful}
                      className={`w-40 h-10 rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 overflow-hidden
    ${
      isApplicationSuccessful
        ? "bg-forest-600 hover:bg-forest-700"
        : isApplicationFailed
          ? "bg-rose-600 hover:bg-rose-700"
          : "bg-primary hover:bg-primary/90"
    } text-white relative shadow-sm`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isApplicationLoading ? (
                          <motion.span
                            key="loading"
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Applying...
                          </motion.span>
                        ) : isApplicationSuccessful ? (
                          <motion.span
                            key="success"
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{
                              type: "spring",
                              bounce: 0.4,
                              duration: 0.5,
                            }}
                            className="flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Applied
                          </motion.span>
                        ) : isApplicationFailed ? (
                          <motion.span
                            key="failed"
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{
                              type: "spring",
                              bounce: 0.6,
                              duration: 0.4,
                            }}
                            className="flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            Failed
                          </motion.span>
                        ) : (
                          <motion.span
                            key="apply"
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center"
                          >
                            Apply
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  )}
                </div>
                <h2 className="font-semibold text-2xl">
                  More Info about the company
                </h2>
                <p
                  className=" text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedHtml(data.company_description),
                  }}
                ></p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
