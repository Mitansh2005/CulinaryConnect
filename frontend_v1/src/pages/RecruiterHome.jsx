import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { useJobs } from "@/api/jobs-data";
import { useApplications, useCompanyInfo } from "@/api/home-data";
import { getUid } from "@/firebase/authUtils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  EmptyPanel,
  MetricCard,
  PageShell,
  SectionHeading,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { JobCardSkeleton, StatCardSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import { formatDate } from "@/utils/formatters";

function getApplicationTone(status) {
  if (status === "a" || status === "h") return "success";
  if (status === "r") return "danger";
  return "warning";
}

function getApplicationLabel(status) {
  if (status === "a") return "Shortlisted";
  if (status === "h") return "Hired";
  if (status === "r") return "Rejected";
  return "Pending";
}

export default function RecruiterHome() {
  const navigate = useNavigate();
  const uid = getUid();

  const { jobs = [], loading: jobsLoading, error: jobsError } = useJobs();
  const { applications = [], loading: appsLoading, error: appsError } = useApplications();
  const { company, loading: companyLoading, error: companyError } = useCompanyInfo(uid);

  const stats = {
    activeJobs: jobs.filter((job) => job.status !== "closed").length,
    totalApplicants: applications.length,
    shortlisted: applications.filter((app) => app.status === "a").length,
    hired: applications.filter((app) => app.status === "h").length,
  };

  const recentApplicants = applications.slice(0, 4);
  const topJobs = jobs.slice(0, 4);
  const hasError = jobsError || appsError || companyError;

  if (jobsLoading || appsLoading || companyLoading) {
    return (
      <PageShell
        description="Loading company performance, hiring pipeline, and open roles."
        eyebrow="Recruiter studio"
        title="Preparing your hiring workspace"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
          <div className="skeleton-shimmer h-72 rounded-[1.75rem]" />
        </div>
      </PageShell>
    );
  }

  if (hasError) {
    return (
      <PageShell
        description="The dashboard could not be assembled from the current API responses."
        eyebrow="Recruiter studio"
        title="We could not load your dashboard"
      >
        <EmptyPanel
          action={
            <Button onClick={() => window.location.reload()} type="button">
              Reload dashboard
            </Button>
          }
          description={hasError}
          title="Hiring analytics are temporarily unavailable."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={
        <>
          <Button onClick={() => navigate("/jobs/manage")} type="button" variant="outline">
            Manage roles
          </Button>
          <Button onClick={() => navigate("/post-job")} type="button">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post new role
          </Button>
        </>
      }
      description="Monitor open roles, candidate flow, and where your team should act next."
      eyebrow="Recruiter studio"
      title={`Run a sharper hiring operation for ${company?.name || "your kitchen"}`}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          helper="Roles still open or actively recruiting."
          icon={BriefcaseBusiness}
          label="Active roles"
          value={stats.activeJobs}
        />
        <MetricCard
          helper="Applicants currently in your pipeline."
          icon={Users}
          label="Total applicants"
          tone="brass"
          value={stats.totalApplicants}
        />
        <MetricCard
          helper="Candidates you have moved forward."
          icon={BadgeCheck}
          label="Shortlisted"
          tone="slate"
          value={stats.shortlisted}
        />
        <MetricCard
          helper="Roles converted into confirmed hires."
          icon={Sparkles}
          label="Hired"
          tone="primary"
          value={stats.hired}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <SurfaceCard className="p-5 sm:p-6">
            <SectionHeading
              action={
                <Button onClick={() => navigate("/applications")} type="button" variant="ghost">
                  View all candidates
                </Button>
              }
              description="The latest applicants across your active positions."
              eyebrow="Candidate activity"
              title="Recent applicants"
            />
            <div className="mt-5 grid gap-3">
              {recentApplicants.length === 0 ? (
                <EmptyPanel
                  className="min-h-[220px]"
                  description="Post a role to start building a reviewed pipeline of chefs and hospitality talent."
                  title="No applications yet"
                />
              ) : (
                recentApplicants.map((application) => {
                  const applicant = application.applicant || {};
                  const appId = application.application_id || application.id;

                  return (
                    <button
                      className="flex flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-white/90 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm dark:border-white/10 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                      key={appId}
                      onClick={() => navigate(`/applicant/${appId}`)}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar
                          className="h-14 w-14 rounded-[1.25rem]"
                          name={`${applicant.first_name || ""} ${applicant.last_name || ""}`}
                          src={applicant.profile_picture}
                        />
                        <div>
                          <p className="font-semibold text-text-main-light dark:text-text-main-dark">
                            {applicant.first_name || "Chef"} {applicant.last_name || "Applicant"}
                          </p>
                          <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                            Applied for {application.job?.title || "open role"}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-sub-light/80 dark:text-text-sub-dark/80">
                            {formatDate(application.application_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusPill tone={getApplicationTone(application.status)}>
                          {getApplicationLabel(application.status)}
                        </StatusPill>
                        <ArrowRight className="h-4 w-4 text-text-sub-light dark:text-text-sub-dark" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 sm:p-6">
            <SectionHeading
              action={
                <Button onClick={() => navigate("/jobs/manage")} type="button" variant="ghost">
                  Open role board
                </Button>
              }
              description="Roles with the highest current attention from candidates."
              eyebrow="Role performance"
              title="Top active jobs"
            />
            <div className="mt-5 grid gap-3">
              {topJobs.length === 0 ? (
                <EmptyPanel
                  className="min-h-[220px]"
                  description="Create the first job posting to start collecting applicants and analytics."
                  title="No roles posted yet"
                />
              ) : (
                topJobs.map((job) => {
                  const applicantCount = applications.filter(
                    (application) => application.job?.job_id === job.job_id
                  ).length;

                  return (
                    <div
                      className="flex flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-white/90 p-5 dark:border-white/10 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                      key={job.job_id}
                    >
                      <div>
                        <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                          {job.title}
                        </p>
                        <p className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                          {job.employment_type || "Full Time"} role at {company?.name || job.company_name}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusPill tone="info">{applicantCount} applicants</StatusPill>
                          <StatusPill tone={job.status === "closed" ? "danger" : "success"}>
                            {job.status === "closed" ? "Closed" : "Live"}
                          </StatusPill>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => navigate(`/job/${job.job_id}`)} type="button" variant="outline">
                          Review role
                        </Button>
                        <Button onClick={() => navigate("/applications")} type="button">
                          View applicants
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SurfaceCard>
        </div>

        <div className="grid gap-6">
          <SurfaceCard className="p-5 sm:p-6">
            <SectionHeading
              description="This company identity follows the Verdant Atelier direction and acts as the hiring trust anchor."
              eyebrow="Company signal"
              title="Brand at a glance"
            />
            <div className="mt-5 flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-[1.4rem]" name={company?.name || "Kitchen"} src={company?.logo} />
              <div>
                <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                  {company?.name || "Restaurant"}
                </p>
                <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                  {company?.size || "Hospitality team"} workforce
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
              {company?.description
                ? String(company.description).replace(/<[^>]+>/g, " ").slice(0, 220).trim() + "..."
                : "Complete the company profile to communicate credibility, kitchen standards, and what candidates should expect."}
            </p>
            <Button className="mt-5 w-full" onClick={() => navigate("/company-profile")} type="button">
              Open company profile
            </Button>
          </SurfaceCard>

          <SurfaceCard className="bg-gradient-to-br from-primary via-ember-500 to-secondary p-6 text-primary-foreground dark:border-white/10">
            <p className="section-kicker text-primary-foreground/70">Operating note</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em]">
              Verified work history is your advantage.
            </h2>
            <p className="mt-4 text-sm leading-7 text-primary-foreground/80">
              Every clear job brief, every quick response, and every consistent review strengthens trust in the marketplace.
            </p>
            <Button
              className="mt-6 w-full border-white/20 bg-white/15 text-white hover:bg-white/20"
              onClick={() => navigate("/post-job")}
              type="button"
              variant="outline"
            >
              Publish another opening
            </Button>
          </SurfaceCard>
        </div>
      </div>
    </PageShell>
  );
}
