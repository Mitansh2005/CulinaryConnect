import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookmarkCheck,
  BriefcaseBusiness,
  Compass,
  Search,
  UserRound,
  X,
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
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
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
    const query = debouncedSearchQuery.toLowerCase().trim();
    if (!query) return true;

    // Build a flat list of every searchable text fragment from the job
    const searchableFields = [
      job.title,
      job.company_name,
      job.location?.city,
      job.location?.state,
      job.location?.country,
      job.location?.postal_code,
      job.salary != null ? String(job.salary) : null,
      job.employment_type,
      // Strip HTML tags from rich-text fields before matching
      job.description?.replace(/<[^>]+>/g, " "),
      job.requirements?.replace(/<[^>]+>/g, " "),
    ];

    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(query),
    );
  });

  const activeApplications = applications.filter((app) =>
    ["p", "a", "h"].includes(app.status),
  );
  const displayedJobs = filteredJobs;

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [],
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
              variant="outline"
              className="border-border text-foreground hover:bg-muted dark:border-white/20 dark:text-white dark:bg-white/10 dark:hover:bg-white/20"
            >
              <BookmarkCheck className="mr-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
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
            onClick={() => searchInputRef.current?.focus()}
          />
          <MetricCard
            helper="Applications currently moving through review."
            icon={Compass}
            label="Active applications"
            tone="brass"
            value={activeApplications.length}
            className="cc-stagger-item"
            onClick={() => navigate("/applications")}
          />
          <MetricCard
            helper="Roles you bookmarked for a second look."
            icon={BookmarkCheck}
            label="Saved jobs"
            tone="brass"
            value={likedJobs.length}
            className="cc-stagger-item"
            onClick={() => navigate("/liked-jobs")}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] items-start">
          <div className="flex flex-col gap-6">
            <SurfaceCard className="cc-reveal p-5 sm:p-6">
              <SectionHeading
                description="Search by role, kitchen, location, salary, employment type — anything on the listing."
                eyebrow="Discovery"
                title="Curated role pipeline"
                action={
                  <StatusPill tone={displayedJobs.length > 0 ? "salary" : "neutral"}>
                    {displayedJobs.length}{" "}
                    {displayedJobs.length === 1 ? "role" : "roles"}
                  </StatusPill>
                }
              />
              <div className="mt-5 relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark" />
                <input
                  ref={searchInputRef}
                  aria-label="Search jobs by title, city, salary, or type"
                  className="soft-input w-full pl-11 pr-10"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search jobs by title, city, salary, type..."
                  type="text"
                  value={searchQuery}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search query"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-text-sub-light hover:bg-black/5 hover:text-text-main-light dark:text-text-sub-dark dark:hover:bg-white/10 dark:hover:text-text-main-dark transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </SurfaceCard>

            <div className="grid gap-4">
              {displayedJobs.length === 0 ? (
                <EmptyPanel
                  className="cc-scroll-in"
                  action={
                    searchQuery ? (
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          searchInputRef.current?.focus();
                        }}
                        type="button"
                      >
                        Clear search filter
                      </Button>
                    ) : null
                  }
                  description={
                    searchQuery
                      ? "Try widening your search terms or clearing the filter to see more roles."
                      : "New kitchen opportunities are posted regularly. Check back soon."
                  }
                  title={
                    searchQuery
                      ? "No jobs match this search"
                      : "No open roles right now"
                  }
                />
              ) : (
                displayedJobs.map((job) => (
                  <JobPreviewCard
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
                    primaryLabel="Open role"
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
                  className="h-full rounded-full bg-primary dark:bg-secondary transition-all duration-500"
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
                onClick={() => navigate("/profile")}
                type="button"
              >
                View & update profile
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
