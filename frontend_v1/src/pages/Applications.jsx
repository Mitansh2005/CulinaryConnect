import { useRef } from "react";
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

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-start h-screen py-10 px-4 w-full">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-text-main-light dark:text-white tracking-wide">
            JOB APPLICATIONS
          </h1>
          <div className="flex flex-col gap-4">
            <ApplicationRowSkeleton />
            <ApplicationRowSkeleton />
            <ApplicationRowSkeleton />
            <ApplicationRowSkeleton />
          </div>
        </div>
      </div>
    );

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
