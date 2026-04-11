/* eslint-disable react/prop-types */
import { JobSeekerProfileCard } from "@/components/ui/custom/ApplicantResume";
import { baseUrl } from "@/constants/constants";
import { getFreshIdToken } from "@/firebase/authUtils";
import axios from "axios";
import { useState } from "react";
import { ImLocation } from "react-icons/im";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
export const ApplicationCard = ({ application }) => {
	const { job, applicant, application_date } = application;
	const user = applicant.user;
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
	const statusClass =
		currentStatus === "p"
			? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/12 dark:text-amber-200"
			: currentStatus === "a"
				? "border-forest-200 bg-forest-50 text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/12 dark:text-forest-200"
				: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/12 dark:text-rose-200";
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
			<div className="flex w-full flex-col justify-between rounded-xl border border-border-light/80 bg-white/92 p-5 text-base shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
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
								className="relative z-[101] w-[90%] max-w-4xl rounded-xl bg-white p-6 shadow-xl dark:bg-[#241f1b]"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.2 }}
							>
								<button
									onClick={() => setShowProfile(false)}
									className="absolute right-4 top-4 text-xl text-text-sub-light hover:text-rose-500 dark:text-text-sub-dark dark:hover:text-rose-300"
								>
									✕
								</button>
								<JobSeekerProfileCard profile={selectedProfile} />
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="flex flex-col gap-2">
					<div className="text-xl font-semibold text-text-main-light dark:text-text-main-dark">
						{user.username}
					</div>

					<div className="text-lg text-text-main-light dark:text-text-main-dark">
						<div className="font-medium">{user.email}</div>
						<div className="text-text-sub-light dark:text-text-sub-dark">
							{job.title} @ {job.company_name}
						</div>
						<div className="flex items-center text-text-sub-light dark:text-text-sub-dark">
							<ImLocation className="mr-1" />
							{jobLocation}
						</div>
					</div>

					<div className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
						Applied on: {application_date}
					</div>

					<div className="mt-2">
						<span
							className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClass}`}
						>
							{statusText}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 mt-4">
					<button
						className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${currentStatus !== "p"
							? "cursor-not-allowed border-border-light text-text-sub-light dark:border-border-dark dark:text-text-sub-dark"
							: "border-forest-600 text-forest-700 hover:bg-forest-600 hover:text-white dark:border-forest-400 dark:text-forest-200 dark:hover:bg-forest-500 dark:hover:text-[#102216]"
							}`}
						onClick={() => handleHireClick("a")}
						disabled={currentStatus !== "p" || loading}
					>
						{loading ? "Hiring..." : currentStatus === "a" ? "Hired" : "Hire"}
					</button>

					<button
						className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${currentStatus !== "p"
							? "cursor-not-allowed border-border-light text-text-sub-light dark:border-border-dark dark:text-text-sub-dark"
							: "border-rose-600 text-rose-700 hover:bg-rose-600 hover:text-white dark:border-rose-400 dark:text-rose-200 dark:hover:bg-rose-500 dark:hover:text-white"
							}`}
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
						className="rounded-lg border border-secondary px-4 py-1.5 text-sm font-medium text-secondary transition hover:bg-secondary hover:text-white dark:border-secondary dark:text-secondary dark:hover:text-[#102216]"
					>
						Message
					</Link>

					<button
						className="rounded-lg border border-primary px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white dark:border-primary dark:text-primary"
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
