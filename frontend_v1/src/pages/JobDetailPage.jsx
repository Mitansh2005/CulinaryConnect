import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  MapPin,
  NotebookPen,
  Wallet,
} from "lucide-react";
import { useJobDetails } from "@/api/jobs-data";
import { applyForJob } from "@/api/apply-for-job";
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

function sanitizeRichText(value) {
  return DOMPurify.sanitize(value || "", {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "p", "br", "ul", "ol", "li"],
  });
}
import { useUser } from "@/contexts/UserContext";

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const uid = getUid();
  const { userData } = useUser();
  const userType = userData?.user_type;
  const { data, loading, error } = useJobDetails(id);
  const [applyState, setApplyState] = useState("idle");
  const [applyError, setApplyError] = useState("");

  const daysRemaining = useMemo(() => {
    if (!data?.application_deadline) return null;
    const difference = new Date(data.application_deadline).getTime() - Date.now();
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
      setApplyError(submissionError?.message || "Something went wrong while applying.");
    }
  };

  if (loading) {
    return (
      <PageShell
        description="Loading the job brief, requirements, and company context."
        eyebrow="Role details"
        title="Preparing the opportunity page"
      >
        <SurfaceCard className="flex min-h-[320px] items-center justify-center">
          <Spinner label="Loading role details" />
        </SurfaceCard>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell
        description="The role could not be loaded from the API."
        eyebrow="Role details"
        title="We could not find that job"
      >
        <EmptyPanel
          action={
            <Button onClick={() => navigate("/home")} type="button">
              Return home
            </Button>
          }
          description={error || "The job may have been removed or is no longer accessible."}
          title="This listing is unavailable."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={
        <>
          <Button onClick={() => navigate(-1)} type="button" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {userType !== "restaurant" ? (
            <Button disabled={applyState === "loading" || applyState === "success"} onClick={handleApply} type="button">
              {applyState === "loading"
                ? "Submitting..."
                : applyState === "success"
                  ? "Application sent"
                  : "Apply now"}
            </Button>
          ) : (
            <Button onClick={() => navigate("/jobs/manage")} type="button">
              Manage role
            </Button>
          )}
        </>
      }
      description="Use this brief to evaluate the kitchen, role expectations, and whether the opportunity is worth action."
      eyebrow="Role details"
      title={data.title}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <SurfaceCard className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-[1.35rem]" icon={Building2} name={data.company_name} src={data.company_logo} />
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
                <StatusPill tone="info">{data.employment_type || "Full Time"}</StatusPill>
                {daysRemaining !== null ? (
                  <StatusPill tone={daysRemaining <= 3 ? "warning" : "success"}>
                    {daysRemaining === 0 ? "Closes today" : `${daysRemaining} days left`}
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

          <SurfaceCard className="p-5 sm:p-6">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
              Role overview
            </h3>
            <div
              className="prose mt-4 max-w-none text-sm leading-8 text-text-sub-light dark:prose-invert dark:text-text-sub-dark"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(data.description) }}
            />
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
              Requirements
            </h3>
            <div
              className="prose mt-4 max-w-none text-sm leading-8 text-text-sub-light dark:prose-invert dark:text-text-sub-dark"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(data.requirements) }}
            />
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
              About the company
            </h3>
            <div
              className="prose mt-4 max-w-none text-sm leading-8 text-text-sub-light dark:prose-invert dark:text-text-sub-dark"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(data.company_description) }}
            />
          </SurfaceCard>
        </div>

        <div className="grid gap-6">
          <SurfaceCard className="p-5 sm:p-6">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
              Quick facts
            </h3>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">Compensation</p>
                <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                  <Wallet className="h-4 w-4" />
                  {formatCurrency(data.salary)}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">Location</p>
                <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                  <MapPin className="h-4 w-4" />
                  {[data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(", ")}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">Posted</p>
                <p className="mt-2 inline-flex items-center gap-2 font-semibold text-text-main-light dark:text-text-main-dark">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(data.posted_date)}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">Deadline</p>
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
  );
}
