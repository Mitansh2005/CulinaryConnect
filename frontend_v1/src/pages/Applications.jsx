import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "boneyard-js/react";
import { ApplicationRowSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import { ApplicationGroup } from "./ApplicationGroup";
import { ApplicantApplications } from "./ApplicantApplication";
import { useUser } from "@/contexts/UserContext";
import { useApplications } from "@/api/home-data";
import {
  MetricCard,
  PageShell,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { Button } from "@/components/ui/button";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";

export const Applications = () => {
  const scopeRef = useRef(null);
  const navigate = useNavigate();
  const { userData } = useUser();
  const userType = userData?.user_type;
  const { data: applications = [], isLoading, isError } = useApplications();

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [],
  });

  // Group recruiter applications by job title
  const groupedApplications = applications.reduce((acc, app) => {
    const title = app.job?.title ?? "Unknown Job";
    if (!acc[title]) acc[title] = [];
    acc[title].push(app);
    return acc;
  }, {});

  const totalApplied = applications.length;
  const pendingCount = applications.filter((a) => a.status === "p").length;
  const acceptedCount = applications.filter((a) => a.status === "a").length;
  const hiredCount = applications.filter((a) => a.status === "h").length;

  if (isLoading) {
    const isRest = userType === "restaurant";
    return (
      <PageShell
        eyebrow={isRest ? "Restaurant" : "Profile"}
        title={isRest ? "Candidates" : "My applications"}
        description="Loading application data..."
      >
        <Skeleton
          animate="shimmer"
          loading={true}
          fallback={
            <div className="flex flex-col gap-4">
              <ApplicationRowSkeleton />
              <ApplicationRowSkeleton />
              <ApplicationRowSkeleton />
              <ApplicationRowSkeleton />
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <ApplicationRowSkeleton />
            <ApplicationRowSkeleton />
            <ApplicationRowSkeleton />
            <ApplicationRowSkeleton />
          </div>
        </Skeleton>
      </PageShell>
    );
  }

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load applications. Please try again.
      </div>
    );

  if (userType === "restaurant") {
    return (
      <div ref={scopeRef}>
        <PageShell
          actions={
            <Button onClick={() => navigate("/home")} type="button" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Button>
          }
          eyebrow="Restaurant"
          title="Candidates"
          description="Review and manage applicants across all your active roles."
          headerClassName="cc-reveal"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              className="cc-stagger-item"
              helper="Inbound candidate applications."
              icon={Users}
              label="Total candidates"
              value={totalApplied}
            />
            <MetricCard
              className="cc-stagger-item"
              helper="Awaiting review."
              icon={Clock3}
              label="Pending review"
              tone="brass"
              value={pendingCount}
            />
            <MetricCard
              className="cc-stagger-item"
              helper="Selected or hired candidates."
              icon={Sparkles}
              label="Shortlisted & hired"
              tone="primary"
              value={acceptedCount + hiredCount}
            />
          </div>

          <div className="flex flex-col gap-6">
            {Object.entries(groupedApplications).map(([title, apps]) => (
              <ApplicationGroup
                key={title}
                jobTitle={title}
                applications={apps}
              />
            ))}
            {applications.length === 0 && (
              <SurfaceCard className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-amber-300">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-text-main-light dark:text-text-main-dark">
                    No applications yet
                  </p>
                  <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                    Candidates who apply to your roles will appear here.
                  </p>
                </div>
              </SurfaceCard>
            )}
          </div>
        </PageShell>
      </div>
    );
  }

  return (
    <div ref={scopeRef}>
      <PageShell
        actions={
          <Button onClick={() => navigate("/home")} type="button" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to discovery
          </Button>
        }
        eyebrow="Chef workspace"
        title="My applications"
        description="Track the status and progress of every role you have applied for."
        headerClassName="cc-reveal"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            className="cc-stagger-item"
            helper="All submitted applications."
            icon={FileText}
            label="Total applied"
            value={totalApplied}
          />
          <MetricCard
            className="cc-stagger-item"
            helper="Currently awaiting kitchen review."
            icon={Clock3}
            label="Under review"
            tone="brass"
            value={pendingCount}
          />
          <MetricCard
            className="cc-stagger-item"
            helper="Selected for interview / trial."
            icon={CheckCircle2}
            label="Shortlisted"
            tone="primary"
            value={acceptedCount}
          />
          <MetricCard
            className="cc-stagger-item"
            helper="Confirmed job offers."
            icon={Sparkles}
            label="Offers & hired"
            tone="primary"
            value={hiredCount}
          />
        </div>

        <ApplicantApplications applications={applications} />
      </PageShell>
    </div>
  );
};
