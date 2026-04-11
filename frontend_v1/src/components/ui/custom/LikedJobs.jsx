import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLikedJobs } from "@/api/home-data";
import { Button } from "@/components/ui/button";
import { JobCardSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import {
  EmptyPanel,
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { JobPreviewCard } from "./job-preview-card";

export function LikedJobs() {
  const navigate = useNavigate();
  const { likedJobs = [], loading, error } = useLikedJobs();

  if (loading) {
    return (
      <PageShell
        description="Pulling together the roles you bookmarked for later."
        eyebrow="Saved pipeline"
        title="Loading liked jobs"
      >
        <JobCardSkeleton />
        <JobCardSkeleton />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell
        description="The saved-jobs list could not be loaded from the API."
        eyebrow="Saved pipeline"
        title="We could not load your liked jobs"
      >
        <EmptyPanel
          action={
            <Button onClick={() => window.location.reload()} type="button">
              Retry
            </Button>
          }
          description={error}
          title="Saved jobs are temporarily unavailable."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={
        <Button onClick={() => navigate("/home")} type="button" variant="outline">
          Back to discovery
        </Button>
      }
      description="A shortlist of roles you marked worth revisiting."
      eyebrow="Saved pipeline"
      title="Liked jobs"
    >
      <SurfaceCard className="p-5 sm:p-6">
        <SectionHeading
          description="Use this space as a deliberate shortlist before you commit applications."
          eyebrow="Saved roles"
          title={`${likedJobs.length} bookmarked opportunities`}
        />
      </SurfaceCard>

      {likedJobs.length === 0 ? (
        <EmptyPanel
          action={
            <Button onClick={() => navigate("/home")} type="button">
              Browse open roles
            </Button>
          }
          className="min-h-[320px]"
          description="When you save a role from the feed, it will appear here as part of your private shortlist."
          icon={Heart}
          title="No liked jobs yet"
        />
      ) : (
        <div className="grid gap-4">
          {likedJobs.map((job) => (
            <JobPreviewCard
              accentLabel="Saved"
              job={job}
              key={job.job_id}
              onPrimaryAction={() => navigate(`/job/${job.job_id}`)}
              primaryLabel="Review role"
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
