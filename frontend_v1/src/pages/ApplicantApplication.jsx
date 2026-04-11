import { LuExternalLink } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
export const ApplicantApplications = ({ applications }) => {
  const navigate = useNavigate();
  console.log(applications);
	if (!applications || applications.length === 0) {
		return (
			<div className="text-center text-text-sub-light dark:text-gray-400 py-10 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mt-6">
				<h2 className="text-2xl font-semibold">No Applications Found</h2>
				<p className="mt-2">You haven’t applied to any jobs yet.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
			{applications.map((app) => {
				const job = app.job;
				const status = app.status;
				const statusColor = status === "a"
					? "text-green-600 bg-green-100"
					: status === "r"
					? "text-red-600 bg-red-100"
					: "text-yellow-600 bg-yellow-100";

				return (
					<div
						key={app.application_id}
						className={`p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm transition hover:shadow-md ${
							status ==='r' ? "bg-red-50/50 dark:bg-red-900/10" :  status === 'a' ? "bg-green-50/50 dark:bg-green-900/10" :"bg-white dark:bg-[#1a2c20]"
						}`}
					>
            <div className="flex flex-row justify-between">
						<h3 className="text-xl font-bold mb-1 text-text-main-light dark:text-white">{job.title}</h3>
            <LuExternalLink className="cursor-pointer text-text-sub-light hover:text-primary" onClick={() => navigate(`/job/${job.job_id}`)} />
            </div>
						<p className="text-text-sub-light dark:text-gray-300 font-medium">{job.company_name}</p>
						<p className="text-sm text-gray-400">{job.location.city}, {job.location.state}</p>
						<p className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
							{status === "a" ? "Accepted" : status === "r" ? "Rejected" : "Pending"}
						</p>
						{status === 'r' ? (
							<div className="mt-4 text-red-600 bg-red-100 p-2 rounded-md text-sm">
								You have been rejected for this job.
							</div>
						):status === 'a' ? (
              <div className="mt-4 text-green-600 bg-green-100 p-2 rounded-md text-sm">
                You have been selected for this job.
                </div>
            ):(
              <div className="mt-4 text-yellow-600 bg-yellow-100 p-2 rounded-md text-sm">Your application is under review.</div>
            )}
					</div>
				);
			})}
		</div>
	);
};
