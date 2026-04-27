import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookmarkCheck,
  BriefcaseBusiness,
  Compass,
  Search,
  UserRound,
} from "lucide-react";
import { useJobs } from "@/api/jobs-data";
import {
  calculateProfileCompletion,
  useApplications,
  useLikedJobs,
  useProfile,
  useToggleLikeJob,
  // useRecommendedJobs,
} from "@/api/home-data";
import { getUid } from "@/firebase/authUtils";
import { useUser } from "@/contexts/UserContext";
import { useDebounce } from "@/components/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { JobCardSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import {
  EmptyPanel,
  MetricCard,
  PageShell,
  SectionHeading,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { JobPreviewCard } from "@/components/ui/custom/job-preview-card";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

export default function JobSeekerHome() {
  const scopeRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const uid = getUid();

  const {
    data: jobs = [],
    isLoading: jobsLoading,
    isError: jobsError,
  } = useJobs();
  // const { recommendedJobs = [], loading: recommendedLoading } =
  //   useRecommendedJobs();
  const { data: applications = [], isLoading: appsLoading } = useApplications();
  const { data: likedJobs = [], isLoading: likedLoading } = useLikedJobs();
  const { data: profile } = useProfile(uid);
  const { userData } = useUser();
  const userType = userData?.user_type;

  const { mutate: toggleLike, isPending: togglePending } = useToggleLikeJob();
  const savedJobIds = new Set((likedJobs || []).map((j) => j.job_id));

  const { percentage: profileCompletion, missingItems } =
    calculateProfileCompletion(profile);

  const filteredJobs = jobs.filter((job) => {
    const query = debouncedSearchQuery.toLowerCase();
    return (
      !query ||
      job.title?.toLowerCase().includes(query) ||
      job.company_name?.toLowerCase().includes(query) ||
      job.location?.city?.toLowerCase().includes(query)
    );
  });

  const activeApplications = applications.filter((app) =>
    ["p", "a", "h"].includes(app.status),
  );
  const displayedJobs = activeTab === "saved" ? likedJobs : filteredJobs;

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [activeTab, profileCompletion, activeApplications.length],
  });

  if (jobsLoading) {
    return (
      <PageShell
        description="Curating the latest verified kitchens and open roles for you."
        eyebrow="Chef workspace"
        title="Finding culinary roles"
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
          <div className="grid gap-4">
            <div className="skeleton-shimmer h-64 rounded-[1.75rem]" />
            <div className="skeleton-shimmer h-56 rounded-[1.75rem]" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (jobsError) {
    return (
      <PageShell
        description="The discovery feed could not be loaded from the API."
        eyebrow="Chef workspace"
        title="We could not load job discovery"
      >
        <EmptyPanel
          action={
            <Button onClick={() => window.location.reload()} type="button">
              Retry feed
            </Button>
          }
          description={jobsError}
          title="The job feed is temporarily unavailable."
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
              onClick={() => navigate("/liked-jobs")}
              type="button"
              variant="outline dark:default"
              className="
              border-border text-foreground
              hover:bg-muted hover:text-foreground
              dark:border-white/20 dark:text-white
              dark:bg-white/10 dark:hover:bg-white/20
            "
            >
              Open saved jobs
            </Button>
            <Button onClick={() => navigate("/profile")} type="button">
              Complete profile
            </Button>
          </>
        }
        description="Discover verified kitchens, clearer expectations, and roles matched to your track record."
        eyebrow="Chef workspace"
        headerClassName="cc-reveal"
        title="Find your next kitchen with stronger signal"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            helper="Open opportunities available right now."
            icon={BriefcaseBusiness}
            label="Open roles"
            value={jobs.length}
            className="cc-stagger-item"
          />
          <MetricCard
            helper="Applications still moving through review."
            icon={Compass}
            label="Active applications"
            tone="brass"
            value={activeApplications.length}
            className="cc-stagger-item"
          />
          <MetricCard
            helper="Roles you bookmarked for a second look."
            icon={BookmarkCheck}
            label="Saved jobs"
            tone="slate"
            value={likedJobs.length}
            className="cc-stagger-item"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-6">
            <SurfaceCard className="cc-reveal p-5 sm:p-6">
              <SectionHeading
                description="Search by role, restaurant, or city, then switch between the full feed and your saved shortlist."
                eyebrow="Discovery"
                title="Curated role pipeline"
              />
              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
                <label className="relative block flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark" />
                  <input
                    className="soft-input pl-11"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by title, kitchen, or city..."
                    type="text"
                    value={searchQuery}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === "feed"
                        ? "bg-primary text-primary-foreground"
                        : "border border-white/70 bg-white/80 text-text-sub-light dark:border-white/10 dark:bg-white/5 dark:text-text-sub-dark"
                    }`}
                    onClick={() => setActiveTab("feed")}
                    type="button"
                  >
                    Job feed
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === "saved"
                        ? "bg-primary text-primary-foreground"
                        : "border border-white/70 bg-white/80 text-text-sub-light dark:border-white/10 dark:bg-white/5 dark:text-text-sub-dark"
                    }`}
                    onClick={() => setActiveTab("saved")}
                    type="button"
                  >
                    Saved roles
                  </button>
                </div>
              </div>
            </SurfaceCard>

            <div className="grid gap-4">
              {activeTab === "saved" && likedLoading ? (
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : displayedJobs.length === 0 ? (
                <EmptyPanel
                  className="cc-scroll-in"
                  action={
                    <Button
                      onClick={() => {
                        setActiveTab("feed");
                        setSearchQuery("");
                      }}
                      type="button"
                    >
                      Browse fresh roles
                    </Button>
                  }
                  description={
                    activeTab === "saved"
                      ? "Save interesting openings to build a shortlist you can return to later."
                      : "Try widening the search criteria or explore your saved shortlist instead."
                  }
                  title={
                    activeTab === "saved"
                      ? "No saved jobs yet"
                      : "No jobs match this search"
                  }
                />
              ) : (
                displayedJobs.map((job) => (
                  <JobPreviewCard
                    accentLabel={activeTab === "saved" ? "Saved" : undefined}
                    job={job}
                    key={job.job_id}
                    isSaved={savedJobIds.has(job.job_id)}
                    saveLoading={togglePending}
                    userType={userType}
                    onToggleSave={() =>
                      toggleLike({
                        jobId: job.job_id,
                        isSaved: savedJobIds.has(job.job_id),
                        jobData: job,
                      })
                    }
                    onPrimaryAction={() => navigate(`/job/${job.job_id}`)}
                    onSecondaryAction={
                      activeTab === "feed"
                        ? () => navigate(`/job/${job.job_id}`)
                        : undefined
                    }
                    primaryLabel={
                      activeTab === "saved" ? "Review role" : "Open role"
                    }
                    secondaryLabel={
                      activeTab === "feed" ? "Quick apply" : undefined
                    }
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex h-fit flex-col gap-6">
            {/* <SurfaceCard className="p-5 sm:p-6">
            <SectionHeading
              description="Roles aligned to your recent activity and profile signal."
              eyebrow="Recommendations"
              title="Best next moves"
            />
            <div className="mt-5 grid gap-3">
              {recommendedLoading ? (
                <>
                  <div className="skeleton-shimmer h-20 rounded-2xl" />
                  <div className="skeleton-shimmer h-20 rounded-2xl" />
                  <div className="skeleton-shimmer h-20 rounded-2xl" />
                </>
              ) : recommendedJobs.length === 0 ? (
                <EmptyPanel
                  className="min-h-[180px]"
                  description="Complete more of your profile to unlock stronger job matching."
                  title="Recommendations will sharpen as you add signal"
                />
              ) : (
                recommendedJobs.slice(0, 3).map((job) => (
                  <button
                    className="rounded-[1.35rem] border border-white/70 bg-white/75 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                    key={job.job_id}
                    onClick={() => navigate(`/job/${job.job_id}`)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-text-main-light dark:text-text-main-dark">
                          {job.title}
                        </p>
                        <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                          {job.company_name}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-text-sub-light dark:text-text-sub-dark" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </SurfaceCard>*/}

            <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
              <SectionHeading
                description="Recruiters trust complete profiles more and match them faster."
                eyebrow="Profile strength"
                title={`${profileCompletion}% complete`}
              />
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {missingItems.length > 0 ? (
                  missingItems.map((item) => (
                    <StatusPill key={item} tone="warning">
                      {item}
                    </StatusPill>
                  ))
                ) : (
                  <StatusPill tone="success">
                    Profile signal is strong
                  </StatusPill>
                )}
              </div>
              <Button
                className="mt-5 w-full"
                onClick={() => navigate("/contact_form")}
                type="button"
              >
                Update profile details
              </Button>
            </SurfaceCard>

            <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
              <SectionHeading
                description="Keep track of every role you are currently pursuing."
                eyebrow="Live pipeline"
                title="Application momentum"
              />
              <div className="mt-5 grid gap-3">
                {appsLoading ? (
                  <>
                    <div className="skeleton-shimmer h-16 rounded-2xl" />
                    <div className="skeleton-shimmer h-16 rounded-2xl" />
                  </>
                ) : activeApplications.length === 0 ? (
                  <EmptyPanel
                    className="cc-scroll-in min-h-[160px]"
                    description="Apply to a role to start tracking your hiring progress here."
                    icon={UserRound}
                    title="No active applications yet"
                  />
                ) : (
                  activeApplications.slice(0, 4).map((application) => (
                    <button
                      className="cc-scroll-in flex items-center justify-between rounded-[1.35rem] border border-white/70 bg-white/75 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                      key={application.application_id || application.id}
                      onClick={() => navigate("/applications")}
                      type="button"
                    >
                      <div>
                        <p className="font-semibold text-text-main-light dark:text-text-main-dark">
                          {application.job?.title || "Job application"}
                        </p>
                        <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                          {application.job?.company_name || "Culinary employer"}
                        </p>
                      </div>
                      <StatusPill
                        tone={
                          application.status === "a" ||
                          application.status === "h"
                            ? "success"
                            : application.status === "r"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {application.status === "a"
                          ? "Shortlisted"
                          : application.status === "h"
                            ? "Hired"
                            : application.status === "r"
                              ? "Rejected"
                              : "Pending"}
                      </StatusPill>
                    </button>
                  ))
                )}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
