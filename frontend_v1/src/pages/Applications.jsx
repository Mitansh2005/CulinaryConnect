import { useEffect, useState } from "react";
import axios from "axios";
import { ApplicationRowSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import { ApplicationGroup } from "./ApplicationGroup";
import { getFreshIdToken } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import { ApplicantApplications } from "./ApplicantApplication";
export const Applications = () => {
  const [groupedApplications, setGroupedApplications] = useState({});
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userType = localStorage.getItem("userType");
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await getFreshIdToken(true);
        const res = await axios.get(`${baseUrl}/application/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(res.data);
        const grouped = groupByJobTitle(res.data);
        setGroupedApplications(grouped);
      } catch (err) {
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const groupByJobTitle = (applications) => {
    return applications.reduce((acc, app) => {
      const title = app.job.title;
      if (!acc[title]) acc[title] = [];
      acc[title].push(app);
      return acc;
    }, {});
  };

  if (loading)
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
  if (error) {
    return (
      <div className="flex items-start justify-center h-screen mt-10">
        <div className="min-h-[5vh] max-w-2xl flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-xl p-6 shadow-md mx-4">
          <div className="flex items-center text-red-700 mb-2">
            <svg
              className="w-6 h-6 mr-2 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12A9 9 0 103 12a9 9 0 0018 0z"
              />
            </svg>
            <p className="text-xl font-semibold">Failed to load applications</p>
          </div>
          <p className="text-base text-red-600 text-center max-w-md">
            {error ||
              "Something went wrong while fetching the applications. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start py-10 px-4 bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#1a2c20] rounded-xl shadow-sm border border-border-light dark:border-border-dark p-8 w-full max-w-6xl ease-linear duration-300">
        <h1 className="text-3xl font-bold mb-8 text-text-main-light dark:text-white tracking-wide border-b border-border-light pb-4">
          JOB APPLICATIONS
        </h1>

        {Object.keys(groupedApplications).length === 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark text-center text-text-sub-light py-10 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
            <h2 className="text-2xl font-semibold">No Applications Found</h2>
            <p className="text-base mt-2">
              You haven’t received any applications yet.
            </p>
          </div>
        ) : userType === "restaurant" ? (
          Object.entries(groupedApplications).map(([jobTitle, apps]) => (
            <ApplicationGroup
              key={jobTitle}
              title={jobTitle}
              applications={apps}
            />
          ))
        ) : (
          <>
            <ApplicantApplications applications={applications} />
          </>
        )}
      </div>
    </div>
  );
};
