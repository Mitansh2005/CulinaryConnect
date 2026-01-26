import { JobSeekerProfileCard } from "@/components/ui/custom/ApplicantResume";
import { baseUrl } from "@/constants/constants";
import { getFreshIdToken } from "@/firebase/authUtils";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
export const ApplicationCard = ({ application }) => {
	const { job, applicant, application_date } = application;
	const user = applicant.user;
	const navigate = useNavigate();
	console.log(user);
	const [currentStatus, setCurrentStatus] = useState(application.status);
	const [loading, setLoading] = useState(false);
	const [loadingResume, setLoadingResume] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [showProfile, setShowProfile] = useState(false);

	const jobLocation = `${job.location.city}, ${job.location.state}`;
	const statusText =
		currentStatus === "p"
			? "Pending"
			: currentStatus === "a"
				? "Accepted"
				: "Rejected";
	const handleHireClick = async (status) => {
		// Handle hire click logic here
		const applicationId = application.application_id;
		try {
			if (applicationId) {
				// Logic to handle hiring the applicant
				setLoading(true);
				const token = await getFreshIdToken(true);
				const res = await axios.patch(
					`${baseUrl}/application/hire/${applicationId}/`,
					{
						status: status,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				console.log("Applicant hired successfully:", res.data);
				setCurrentStatus(status);
			}
		} catch (error) {
			console.error("Something went wrong when handling hiring ", error);
		} finally {
			setLoading(false);
		}
	};
	const handleViewResume = async () => {
		try {
			setLoadingResume(true);
			const token = await getFreshIdToken(true);
			const res = await axios.get(`${baseUrl}/jobseeker/${user.user_id}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setSelectedProfile(res.data);
			setShowProfile(true);
		} catch (e) {
			console.error("Error fetching resume data:", e);
		} finally {
			setLoadingResume(false);
		}
	};

	return (
		<>
			<div className="bg-white shadow rounded-lg p-5 w-fit flex flex-col justify-between border border-gray-200 text-base">
				<AnimatePresence>
					{showProfile && selectedProfile && (
						<motion.div
							key="jobseeker-card"
							className="fixed inset-0 z-[100] flex justify-center items-center overflow-y-auto"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							{/* BACKDROP */}
							<motion.div
								className="absolute inset-0 bg-black/70 backdrop-blur-sm"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setShowProfile(false)} // allow backdrop click to close
							/>

							{/* MODAL */}
							<motion.div
								className="relative z-[101] bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-4xl"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.2 }}
							>
								<button
									onClick={() => setShowProfile(false)}
									className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
								>
									✕
								</button>
								<JobSeekerProfileCard profile={selectedProfile} />
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="flex flex-col gap-2">
					<div className="font-semibold text-xl text-gray-800">
						{user.username}
					</div>

					<div className="text-gray-700 text-lg">
						<div className="font-medium">{user.email}</div>
						<div className="text-gray-600">
							{job.title} @ {job.company_name}
						</div>
						<div className="text-gray-600 flex items-center">
							<ImLocation className="mr-1" />
							{jobLocation}
						</div>
					</div>

					<div className="text-lg	 text-gray-500 mt-2">
						Applied on: {application_date}
					</div>

					<div className="mt-2">
						<span
							className={`text-sm px-2 py-1 rounded ${currentStatus === "p"
								? "bg-yellow-100 text-yellow-800"
								: currentStatus === "a"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
								}`}
						>
							{statusText}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 mt-4">
					<button
						className={`border ${currentStatus !== "p"
							? "border-gray-400 text-gray-400 cursor-not-allowed"
							: "border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
							} text-sm px-4 py-1.5 rounded-md transition`}
						onClick={() => handleHireClick("a")}
						disabled={currentStatus !== "p" || loading}
					>
						{loading ? "Hiring..." : currentStatus === "a" ? "Hired" : "Hire"}
					</button>

					<button
						className={`border ${currentStatus !== "p"
							? "border-gray-400 text-gray-400 cursor-not-allowed"
							: "border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
							} text-sm px-4 py-1.5 rounded-md transition`}
						onClick={() => handleHireClick("r")}
						disabled={currentStatus !== "p" || loading}
					>
						{loading
							? "Rejecting..."
							: currentStatus === "r"
								? "Rejected"
								: "Reject"}
					</button>

					<Link
						to={`/messages?uid=${user.uid}`}
						className="border text-sm px-4 py-1.5 rounded-md transition
								 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
					>
						Message
					</Link>

					<button
						className="border text-sm px-4 py-1.5 rounded-md transition border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
						onClick={() => {
							handleViewResume();
						}}
						disabled={loadingResume}
					>
						{loadingResume ? "Opening..." : "View Resume"}
					</button>
				</div>
			</div>
		</>
	);
};
