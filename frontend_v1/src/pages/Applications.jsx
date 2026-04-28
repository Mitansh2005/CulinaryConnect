import { useRef } from "react";
import { Skeleton } from "boneyard-js/react";
import { ApplicationRowSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import { ApplicationGroup } from "./ApplicationGroup";
import { ApplicantApplications } from "./ApplicantApplication";
import { useUser } from "@/contexts/UserContext";
import { useApplications } from "@/api/home-data";
import { PageShell } from "@/components/ui/custom/enterprise-shell";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

export const Applications = () => {
  const scopeRef = useRef(null);
  const { userData } = useUser();
  const userType = userData?.user_type;
  const { data: applications = [], isLoading, isError } = useApplications();

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [userType, applications.length, isLoading, isError],
  });

  // Group recruiter applications by job title
  const groupedApplications = applications.reduce((acc, app) => {
    const title = app.job?.title ?? "Unknown Job";
    if (!acc[title]) acc[title] = [];
    acc[title].push(app);
    return acc;
  }, {});

  if (isLoading) {
    const isRest = userType === "restaurant";
    return (
      <PageShell
        eyebrow={isRest ? "Restaurant" : "Profile"}
        title={isRest ? "Job applications" : "My applications"}
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
          eyebrow="Restaurant"
          title="Job applications"
          description="Manage candidates across all active roles."
          headerClassName="cc-reveal"
        >
          <div className="flex flex-col gap-6">
            {Object.entries(groupedApplications).map(([title, apps]) => (
              <ApplicationGroup
                key={title}
                jobTitle={title}
                applications={apps}
              />
            ))}
            {applications.length === 0 && (
              <p className="cc-scroll-in text-text-sub-light dark:text-text-sub-dark">
                No applications yet.
              </p>
            )}
          </div>
        </PageShell>
      </div>
    );
  }

  return (
    <div ref={scopeRef}>
      <PageShell
        eyebrow="Profile"
        title="My applications"
        description="Track the status of roles you have applied for."
        headerClassName="cc-reveal"
      >
        <ApplicantApplications applications={applications} />
      </PageShell>
    </div>
  );
};
