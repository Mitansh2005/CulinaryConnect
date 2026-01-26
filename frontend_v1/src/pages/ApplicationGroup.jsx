import { useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { ApplicationCard } from "./ApplicationCard";
export const ApplicationGroup = ({ title, applications }) => {
  const [showAll, setShowAll] = useState(false);

  const defaultVisible = 3;

  const visibleApps = showAll ? applications : applications.slice(0, defaultVisible);

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <div className="mb-8">

      <div className="bg-white rounded-lg w-fit max-w-6xl px-6 py-4 shadow-md flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="flex items-center gap-3 justify-center">
          {showAll && (
            <button
              onClick={toggleShowAll}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaArrowLeft size={20} />
            </button>
          )}

          <div
            className="flex gap-4"
            style={{
              maxWidth: `${visibleApps.length * 340}px`,
            }}
          >
            {visibleApps.map((app) => (
              <ApplicationCard key={app.application_id} application={app} />
            ))}
          </div>

          {applications.length > defaultVisible && !showAll && (
            <button
              onClick={toggleShowAll}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
