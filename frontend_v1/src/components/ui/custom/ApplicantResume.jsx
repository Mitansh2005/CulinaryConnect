import { ImLocation } from "react-icons/im";
import { MdWork } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import DOMPurify from "dompurify";
export const JobSeekerProfileCard = ({ profile }) => {
	const {
		user,
		experience_years,
		achievements,
		job_type_preference,
		preferred_job_roles,
		relocate_confirmation,
		job_search_status,
	} = profile;

	const statusColor = {
		available: "bg-green-100 text-green-800",
		looking: "bg-yellow-100 text-yellow-800",
		not_looking: "bg-red-100 text-red-800",
	};
  const sanitizedHtml = (data) => DOMPurify.sanitize(data);

	return (
		<div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">{user.username}</h2>
			<p className="text-gray-600 text-base mb-2">{user.email}</p>
      <p className="text-gray-600 text-base mb-2" dangerouslySetInnerHTML={{ __html: sanitizedHtml(user.bio) }}></p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base mt-4">
				<div>
					<strong>Experience:</strong> {experience_years || 0} years
				</div>
				<div>
					<strong>Speciality:</strong> {user.speciality || "—"}
				</div>
				<div>
					<strong>Preferred Job Type:</strong> {job_type_preference || "—"}
				</div>
				<div>
					<strong>Preferred Roles:</strong> {preferred_job_roles || "—"}
				</div>
				<div className="flex items-center gap-2">
					<strong>Willing to Relocate:</strong>
					{relocate_confirmation ? (
						<FaCheckCircle className="text-green-600" />
					) : (
						<FaTimesCircle className="text-red-600" />
					)}
				</div>
				<div>
					<strong>Status:</strong>{" "}
					<span
						className={`px-2 py-1 rounded text-sm font-medium ${statusColor[job_search_status]}`}
					>
						{job_search_status?.replace("_", " ") || "—"}
					</span>
				</div>
			</div>

			{achievements && (
				<div className="mt-6">
					<h3 className="font-semibold text-lg mb-1 text-gray-800">
						Achievements
					</h3>
					<p className="text-gray-600 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: sanitizedHtml(achievements) }}></p>
				</div>
			)}
		</div>
	);
};
