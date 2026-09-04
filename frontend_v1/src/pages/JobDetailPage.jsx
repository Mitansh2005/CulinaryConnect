import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import gsap from "gsap";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarDays,
  MapPin,
  NotebookPen,
  Wallet,
} from "lucide-react";
import { useJobDetails } from "@/api/jobs-data";
import { applyForJob } from "@/api/apply-for-job";
import { useLikedJobs, useToggleLikeJob } from "@/api/home-data";
import { cn } from "@/lib/utils";
import { getUid } from "@/firebase/authUtils";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/custom/spinner";
import {
  Avatar,
  EmptyPanel,
  PageShell,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";
import { Skeleton } from "boneyard-js/react";
import { JobDetailSkeleton } from "@/components/ui/custom/skeletons/JobDetailSkeleton";

function sanitizeRichText(value) {
  return DOMPurify.sanitize(value || "", {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "p", "br", "ul", "ol", "li"],
  });
}
import { useUser } from "@/contexts/UserContext";

export function JobDetailPage() {
  const scopeRef = useRef(null);
  const applyButtonRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const uid = getUid();
  const { userData } = useUser();
  const userType = userData?.user_type;
  const { data: likedJobs = [] } = useLikedJobs();
  const { mutate: toggleLike, isPending: togglePending } = useToggleLikeJob();
  const isJobSaved = likedJobs.some((j) => String(j.job_id) === String(id));
  const { data, isLoading, isFetching, isPending, isError, error } =
    useJobDetails(id);
  const [applyState, setApplyState] = useState("idle");
  const [applyError, setApplyError] = useState("");

  const isJobLoading = isLoading || isFetching || isPending;

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [id, applyState],
  });

  useEffect(() => {
    if (!applyButtonRef.current || applyState !== "success") return;

    const button = applyButtonRef.current;
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        allowMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context?.conditions || {};
        if (reduceMotion) return;

        gsap.fromTo(
          button,
          { scale: 1 },
          {
            scale: 1.06,
            duration: 0.16,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          },
        );
      },
    );

    return () => mm.revert();
  }, [applyState]);

  const daysRemaining = useMemo(() => {
    if (!data?.application_deadline) return null;
    const difference =
      new Date(data.application_deadline).getTime() - Date.now();
    return Math.max(Math.ceil(difference / (1000 * 60 * 60 * 24)), 0);
  }, [data]);

  const handleApply = async () => {
    try {
      setApplyState("loading");
      setApplyError("");
      await applyForJob({
        applicant_uid: uid,
        application_date: new Date().toISOString().split("T")[0],
        job: data.job_id || id,
      });
      setApplyState("success");
    } catch (submissionError) {
      setApplyState("error");
      if (Array.isArray(submissionError) && submissionError.length > 0) {
        setApplyError(submissionError[0]);
      } else if (typeof submissionError === "string") {
        setApplyError(submissionError);
      } else {
        setApplyError(
          submissionError?.message || "Something went wrong while applying.",
        );
      }
      setTimeout(() => {
        setApplyState("idle");
      }, 5000);
    }
  };

  if (isJobLoading) {
    return (
      <PageShell
        description="Loading the job brief, requirements, and company context."
        eyebrow="Role details"
        title="Preparing the opportunity page"
      >
        <Skeleton
          animate="shimmer"
          fallback={<JobDetailSkeleton />}
          loading={isJobLoading}
          name="job-detail-page"
        >
          <JobDetailSkeleton />
        </Skeleton>
      </PageShell>
    );
  }

  if (!isJobLoading && (isError || !data)) {
    return (
      <PageShell
        description="The role could not be loaded from the API."
        eyebrow="Role details"
        title="We could not find that job"
      >
        <EmptyPanel
          action={
            <Button onClick={() => navigate("/home")} type="button">
              Return to discovery
            </Button>
          }
          description={
            error ||
            "This listing may have closed or been removed. Return to discovery to explore open opportunities."
          }
          title="This listing is unavailable."
        />
      </PageShell>
    );
  }

  return (
    <div ref={scopeRef}>
      <PageShell
        actions={
          <>
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {userType !== "restaurant" ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    toggleLike({
                      jobId: Number(id),
                      isSaved: isJobSaved,
                      jobData: data,
                    })
                  }
                  disabled={togglePending}
                  aria-label={isJobSaved ? "Remove from saved roles" : "Save this role"}
                  title={isJobSaved ? "Remove from saved" : "Save this role"}
                  className={cn(
                    "group flex h-10 w-10 items-center justify-center rounded-[16px] border transition-[border-radius,background-color,border-color,color,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] hover:rounded-[10px] active:scale-[0.93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isJobSaved
                      ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 dark:border-primary/40 dark:bg-primary/20 dark:text-primary"
                      : "border-slate-300 bg-white/70 text-slate-600 hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-white/5 dark:text-slate-400 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary",
                    togglePending && "opacity-50 cursor-wait",
                  )}
                >
                  {isJobSaved ? (
                    <BookmarkCheck className="h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-110" />
                  ) : (
                    <Bookmark className="h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-110" />
                  )}
                </button>
                <div className="flex flex-col items-end gap-2 relative">
                <Button
                  disabled={
                    applyState === "loading" || applyState === "success"
                  }
                  onClick={handleApply}
                  type="button"
                  className={`transition-all duration-300 w-40 h-10 flex justify-center items-center shadow-sm overflow-hidden ${
                    applyState === "success"
                      ? "bg-forest-600 hover:bg-forest-700 text-white"
                      : applyState === "error"
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : ""
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {applyState === "loading" ? (
                      <motion.span
                        key="loading"
                        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <Spinner size="sm" inheritColor />
                        Applying...
                      </motion.span>
                    ) : applyState === "success" ? (
                      <motion.span
                        key="success"
                        ref={applyButtonRef}
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
                        <NotebookPen className="w-4 h-4" />
                        Applied
                      </motion.span>
                    ) : applyState === "error" ? (
                      <motion.span
                        key="error"
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
                        Apply now
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
                {applyState === "error" && (
                  <div className="absolute top-12 right-0 z-50 text-sm text-rose-500 font-medium bg-white/95 dark:bg-card-dark/95 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded shadow-md whitespace-nowrap backdrop-blur-sm">
                    {applyError}
                  </div>
                )}
              </div>
            </>
          ) : (
              <Button onClick={() => navigate("/jobs/manage")} type="button">
                Manage role
              </Button>
            )}
          </>
        }
        description="Use this brief to evaluate the kitchen, role expectations, and whether the opportunity is worth action."
        eyebrow="Role details"
        headerClassName="cc-reveal"
        title={data.title}
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-6">
            <SurfaceCard className="cc-reveal p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    className="h-16 w-16 rounded-[1.35rem]"
                    icon={Building2}
                    name={data.company_name}
                    src={data.company_logo}
                  />
                  <div>
                    <p className="section-kicker">Hiring company</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                      {data.company_name}
                    </h2>
                    <p className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                      Verified culinary marketplace listing
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="info">
                    {data.employment_type || "Full Time"}
                  </StatusPill>
                  {daysRemaining !== null ? (
                    <StatusPill
                      tone={daysRemaining <= 3 ? "warning" : "success"}
                    >
                      {daysRemaining === 0
                        ? "Closes today"
                        : `${daysRemaining} days left`}
                    </StatusPill>
                  ) : null}
                </div>
              </div>

              {applyState === "error" && applyError ? (
                <div className="mt-5 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                  {applyError}
                </div>
              ) : null}
            </SurfaceCard>

            <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                Role overview
              </h3>
              <div
                className="prose mt-4 max-w-none text-sm leading-8 text-text-sub-light dark:prose-invert dark:text-text-sub-dark"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(data.description),
                }}
              />
            </SurfaceCard>

            <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                Requirements
              </h3>
              <div
                className="prose mt-4 max-w-none text-sm leading-8 text-text-sub-light dark:prose-invert dark:text-text-sub-dark"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(data.requirements),
                }}
              />
            </SurfaceCard>

            <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                About the company
              </h3>
              <div
                className="prose mt-4 max-w-none text-sm leading-8 text-text-sub-light dark:prose-invert dark:text-text-sub-dark"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(data.company_description),
                }}
              />
            </SurfaceCard>
          </div>

          <div className="grid gap-6">
            <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                Quick facts
              </h3>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">
                    Compensation
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                    <Wallet className="h-4 w-4" />
                    {formatCurrency(data.salary)}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">
                    Location
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                    <MapPin className="h-4 w-4" />
                    {[
                      data.location?.city,
                      data.location?.state,
                      data.location?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">
                    Posted
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(data.posted_date)}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">
                    Deadline
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                    <NotebookPen className="h-4 w-4" />
                    {formatDate(data.application_deadline)}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
