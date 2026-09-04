import { ArrowLeft, Bookmark, BookmarkCheck, Building2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLikedJobs, useToggleLikeJob } from "@/api/home-data";
import { Button } from "@/components/ui/button";
import { JobCardSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import {
  EmptyPanel,
  MetricCard,
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { JobPreviewCard } from "./job-preview-card";

export function LikedJobs() {
  const navigate = useNavigate();
  const { data: likedJobs = [], isLoading, isError } = useLikedJobs();
  const { mutate: toggleLike, isPending: togglePending } = useToggleLikeJob();

  if (isLoading) {
    return (
      <PageShell
        description="Pulling together the roles you bookmarked for later."
        eyebrow="Saved pipeline"
        title="Loading saved jobs"
      >
        <JobCardSkeleton />
        <JobCardSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        description="The saved-jobs list could not be loaded from the API."
        eyebrow="Saved pipeline"
        title="We could not load your saved jobs"
      >
        <EmptyPanel
          action={
            <Button onClick={() => window.location.reload()} type="button">
              Retry
            </Button>
          }
          description="There was a problem fetching your saved roles. Please try again."
          title="Saved jobs are temporarily unavailable."
        />
      </PageShell>
    );
  }

  const savedJobIds = new Set(likedJobs.map((j) => j.job_id));

  return (
    <PageShell
      actions={
        <Button onClick={() => navigate("/home")} type="button" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to discovery
        </Button>
      }
      description="A shortlist of roles you marked worth revisiting."
      eyebrow="Saved pipeline"
      title="Saved jobs"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          className="cc-stagger-item"
          helper="Roles saved for closer review."
          icon={BookmarkCheck}
          label="Bookmarked roles"
          value={likedJobs.length}
        />
        <MetricCard
          className="cc-stagger-item"
          helper="Unique culinary employers represented."
          icon={Building2}
          label="Kitchens"
          tone="brass"
          value={new Set(likedJobs.map((j) => j.company_name).filter(Boolean)).size}
        />
        <MetricCard
          className="cc-stagger-item"
          helper="Different kitchen locations."
          icon={MapPin}
          label="Locations"
          tone="primary"
          value={new Set(likedJobs.map((j) => j.location?.city).filter(Boolean)).size}
        />
      </div>

      {likedJobs.length === 0 ? (
        <EmptyPanel
          action={
            <Button onClick={() => navigate("/home")} type="button">
              Browse open roles
            </Button>
          }
          className="min-h-[320px]"
          description="When you bookmark a role from the feed, it will appear here as part of your private shortlist."
          icon={Bookmark}
          title="No saved jobs yet"
        />
      ) : (
        <div className="grid gap-4">
          {likedJobs.map((job) => (
            <JobPreviewCard
              accentLabel="Saved"
              job={job}
              key={job.job_id}
              isSaved={savedJobIds.has(job.job_id)}
              saveLoading={togglePending}
              userType="chef"
              onToggleSave={() =>
                toggleLike({
                  jobId: job.job_id,
                  isSaved: true,
                  jobData: job,
                })
              }
              onPrimaryAction={() => navigate(`/job/${job.job_id}`)}
              primaryLabel="Review role"
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
