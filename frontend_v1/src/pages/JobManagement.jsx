import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  BriefcaseBusiness,
  PlusCircle,
  Search,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import {
  useCompanyJobs,
  useDeleteJob,
  useUpdateJobStatus,
} from "@/api/job-management-data";
import { useDebounce } from "@/components/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { ApplicationRowSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import {
  EmptyPanel,
  MetricCard,
  PageShell,
  SectionHeading,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

function statusTone(status) {
  if (status === "active") return "success";
  if (status === "closed") return "danger";
  return "warning";
}

export default function JobManagement() {
  const scopeRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const { data: jobs = [], isLoading, error } = useCompanyJobs();
  const deleteJobMutation = useDeleteJob();
  const updateStatusMutation = useUpdateJobStatus();

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        filterStatus === "all" ? true : job.status === filterStatus;
      const query = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.company_name?.toLowerCase().includes(query) ||
        job.location?.city?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [debouncedSearchQuery, filterStatus, jobs]);

  const stats = {
    totalRoles: jobs.length,
    activeRoles: jobs.filter((job) => job.status === "active").length,
    draftRoles: jobs.filter((job) => job.status === "draft").length,
    applicants: jobs.reduce(
      (count, job) => count + (job.applicant_count || 0),
      0,
    ),
  };

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [filterStatus],
  });

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this draft role?")) {
      return;
    }

    try {
      await deleteJobMutation.mutateAsync(jobId);
    } catch (mutationError) {
      console.error("Failed to delete job:", mutationError);
      alert("Failed to delete the draft. Please try again.");
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";

    try {
      await updateStatusMutation.mutateAsync({ jobId, status: newStatus });
    } catch (mutationError) {
      console.error("Failed to update job status:", mutationError);
      alert("Failed to update the role status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <PageShell
        description="Loading your posted roles, applicant counts, and publication state."
        eyebrow="Role operations"
        title="Preparing the role board"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="skeleton-shimmer h-36 rounded-[1.75rem]" />
          <div className="skeleton-shimmer h-36 rounded-[1.75rem]" />
          <div className="skeleton-shimmer h-36 rounded-[1.75rem]" />
          <div className="skeleton-shimmer h-36 rounded-[1.75rem]" />
        </div>
        <ApplicationRowSkeleton />
        <ApplicationRowSkeleton />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell
        description="The role board could not be assembled from the current API response."
        eyebrow="Role operations"
        title="We could not load your job listings"
      >
        <EmptyPanel
          action={
            <Button onClick={() => window.location.reload()} type="button">
              Retry loading
            </Button>
          }
          description={error.message || "Unknown error while loading roles."}
          title="Role management is temporarily unavailable."
        />
      </PageShell>
    );
  }

  return (
    <div ref={scopeRef}>
      <PageShell
        actions={
          <Button onClick={() => navigate("/post-job")} type="button">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post new role
          </Button>
        }
        description="Track every listing with a single operational view across draft, live, and closed positions."
        eyebrow="Role operations"
        headerClassName="cc-reveal"
        title="Manage job postings with less noise"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            className="cc-stagger-item"
            helper="All roles created by your team."
            icon={BriefcaseBusiness}
            label="Total roles"
            value={stats.totalRoles}
          />
          <MetricCard
            className="cc-stagger-item"
            helper="Listings currently available to candidates."
            icon={Sparkles}
            label="Active roles"
            tone="primary"
            value={stats.activeRoles}
          />
          <MetricCard
            className="cc-stagger-item"
            helper="Roles not yet published."
            icon={Workflow}
            label="Drafts"
            tone="warning"
            value={stats.draftRoles}
          />
          <MetricCard
            className="cc-stagger-item"
            helper="Combined inbound candidate volume."
            icon={Users}
            label="Applicants"
            tone="brass"
            value={stats.applicants}
          />
        </div>

        <SurfaceCard className="cc-reveal p-5 sm:p-6">
          <SectionHeading
            description="Filter by lifecycle state and search across role title, company, or city."
            eyebrow="Filters"
            title="Role board"
          />
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark" />
              <input
                className="soft-input pl-11"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, city, or brand..."
                type="text"
                value={searchQuery}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "active", "closed", "draft"].map((status) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "border border-white/70 bg-white/80 text-text-sub-light dark:border-white/10 dark:bg-white/5 dark:text-text-sub-dark"
                  }`}
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  type="button"
                >
                  {status === "all"
                    ? "All roles"
                    : status[0].toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </SurfaceCard>

        {filteredJobs.length === 0 ? (
          <EmptyPanel
            className="cc-scroll-in"
            action={
              <Button onClick={() => navigate("/post-job")} type="button">
                Create a role
              </Button>
            }
            description={
              searchQuery || filterStatus !== "all"
                ? "Adjust the filters or clear the search to see more listings."
                : "Start by publishing the first role so candidates can enter the pipeline."
            }
            title={
              searchQuery || filterStatus !== "all"
                ? "No roles match these filters"
                : "No roles posted yet"
            }
          />
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <SurfaceCard className="cc-scroll-in p-5 sm:p-6" key={job.job_id}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone={statusTone(job.status)}>
                        {job.status || "draft"}
                      </StatusPill>
                      <StatusPill tone="info">
                        {job.applicant_count || 0} applicants
                      </StatusPill>
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-text-main-light dark:text-text-main-dark">
                      {job.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
                      {job.company_name || "Culinary employer"}
                      {job.location?.city ? `, ${job.location.city}` : ""}
                      {job.location?.state ? `, ${job.location.state}` : ""}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusPill>
                        {job.employment_type || "Full Time"}
                      </StatusPill>
                      <StatusPill>
                        {job.posted_date
                          ? format(new Date(job.posted_date), "MMM dd, yyyy")
                          : "Date pending"}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Button
                      onClick={() => navigate(`/job/${job.job_id}`)}
                      type="button"
                      variant="outline"
                    >
                      Open role
                    </Button>
                    <Button
                      onClick={() => navigate("/applications")}
                      type="button"
                      variant="outline"
                    >
                      View applicants
                    </Button>
                    {job.status === "draft" ? (
                      <Button
                        onClick={() => handleDeleteJob(job.job_id)}
                        type="button"
                        variant="destructive"
                      >
                        Delete draft
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleToggleStatus(job.job_id, job.status)
                        }
                        type="button"
                        variant={
                          job.status === "active" ? "destructive" : "secondary"
                        }
                      >
                        {job.status === "active" ? "Close role" : "Reopen role"}
                      </Button>
                    )}
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        )}
      </PageShell>
    </div>
  );
}
