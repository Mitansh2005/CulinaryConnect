import { ApplicationRowSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import { ApplicationGroup } from "./ApplicationGroup";
import { ApplicantApplications } from "./ApplicantApplication";
import { useUser } from "@/contexts/UserContext";
import { useApplications } from "@/api/home-data";

export const Applications = () => {
  const { userData } = useUser();
  const userType = userData?.user_type;
  const { data: applications = [], isLoading, isError } = useApplications();

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
      <div className="flex flex-col items-center justify-start min-h-screen py-10 px-4 w-full">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-text-main-light dark:text-white tracking-wide">
            JOB APPLICATIONS
          </h1>
          <div className="flex flex-col gap-6">
            {Object.entries(groupedApplications).map(([title, apps]) => (
              <ApplicationGroup key={title} jobTitle={title} applications={apps} />
            ))}
            {applications.length === 0 && (
              <p className="text-text-sub-light dark:text-text-sub-dark">No applications yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <ApplicantApplications applications={applications} />;
};
