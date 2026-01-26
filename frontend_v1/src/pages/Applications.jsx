import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/ui/custom/spinner";
import { ApplicationGroup } from "./ApplicationGroup";
import { getFreshIdToken, getUid } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import { ApplicantApplications } from "./ApplicantApplication";
import { DetailJobCard } from "@/components/ui/custom/JobDetailNewDesign";
export const Applications = () => {
  const [groupedApplications, setGroupedApplications] = useState({});
  const [applications, setApplications] = useState({});
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
      <div className="flex items-center justify-center h-screen -mt-10">
        <Spinner />
      </div>
    );
  if (error) {
    return (
      <div className="flex items-start justify-center h-screen mt-10">
        <div className="min-h-[5vh] max-w-2xl flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6 shadow-md mx-4">
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
    <div className="min-h-screen flex justify-center items-start py-10 px-4">
      <div className="backdrop-blur-0 hover:backdrop-blur-sm bg-white/20 rounded-xl shadow-xl p-8 w-full max-w-6xl  ease-linear duration-1000">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-wide">
          JOB APPLICATIONS
        </h1>

        {Object.keys(groupedApplications).length === 0 ? (
          <div className="bg-white text-center text-gray-600 py-10 rounded-xl shadow-md">
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
