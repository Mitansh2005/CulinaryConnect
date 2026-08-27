/* eslint-disable react/prop-types */
import { IoShareSocial } from "react-icons/io5";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { CalendarDays, Clock3, Wallet } from "lucide-react";

import { useEffect, useState } from "react";
import { DetailJobCard } from "./JobDetailNewDesign";
import { motion, AnimatePresence } from "framer-motion";
import { getFreshIdToken } from "@/firebase/authUtils";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
import { formatDate } from "@/utils/formatters";

const badgeStyles = {
	salary:
		"border-ember-200 bg-ember-50 text-ember-700 dark:border-ember-500/20 dark:bg-ember-500/12 dark:text-ember-200",
	location:
		"border-forest-200 bg-forest-50 text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/12 dark:text-forest-200",
	meta:
		"border-white/80 bg-white/90 text-text-sub-light dark:border-white/10 dark:bg-white/10 dark:text-text-sub-dark",
};
export const JobCardDesign = ({
	items,
	className,
	triggerRefresh = () => {},
}) => {
	const [expandedJobId, setExpandedJobId] = useState(null);
	const [isClosing, setIsClosing] = useState(false);
	const [likedJobsMap, setLikedJobsMap] = useState({});
	useEffect(() => {
		const fetchLikedJobs = async () => {
			try {
				const token = await getFreshIdToken(true);
				const res = await axios.get(`${baseUrl}/jobseeker/liked-jobs/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const likedJobIds = res.data.map((job) => job.job_id); // Assuming response is list of jobs
				const map = {};
				likedJobIds.forEach((id) => {
					map[id] = true;
				});
				setLikedJobsMap(map);
			} catch (error) {
				console.error("Failed to fetch liked jobs", error);
			}
		};

		fetchLikedJobs();
	}, []);

	const handleLearnMoreClick = (jobId) => {
		setExpandedJobId(jobId);
	};
	const handleShare = (jobId) => {
		const url = `${window.location.origin}/job/${jobId}`;
		navigator.clipboard
			.writeText(url)
			.then(() => alert("Link copied to clipboard!"))
			.catch(() => alert("Failed to copy link"));
	};
	const handleToggleLike = async (jobId) => {
		try {
			const token = await getFreshIdToken(true);

			// If already liked, send DELETE to unlike
			if (likedJobsMap[jobId]) {
				await axios.delete(`${baseUrl}/jobseeker/liked-jobs/${jobId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLikedJobsMap((prev) => ({ ...prev, [jobId]: false }));
			} else {
				// Not liked, send POST to like
				await axios.post(
					`${baseUrl}/jobseeker/save-liked-jobs/`,
					{ id: jobId },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setLikedJobsMap((prev) => ({ ...prev, [jobId]: true }));
			}
		} catch (error) {
			console.error("Toggle like failed:", error);
		} finally {
			triggerRefresh(); // Refresh liked jobs after toggling
		}
	};

	return (
		<>
			<div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 p-2 w-full ${className || ""}`}>
				{items.map((item) => (
					<motion.div
						layoutId={`job-${item.job_id}`} // 🧠 Unique ID used to "link" animations
						key={item.job_id}
						className={`relative group rounded-[1.4rem] border border-white/80 bg-white/92 p-5 shadow-sm transition-colors duration-300 hover:border-primary/40 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-[#241f1b] dark:hover:bg-[#2A231F] ${
							expandedJobId === item.job_id
								? "opacity-0 pointer-events-none"
								: "opacity-100"
						}`}
					>
						<div className="flex justify-between items-start">
							<img
								loading="lazy"
								src={`data:image/jpeg;base64,${item.company_logo?.replace(/\s/g, "")}`}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.company_name || "Company")}&background=F3E9DC&color=5E3023`;
								}}
								alt="Company Logo"
								className="h-14 w-14 rounded-xl border border-border-light object-cover"
							/>

							<div className="flex gap-2 cursor-pointer">
								<IoShareSocial
									className="h-5 w-5 text-text-sub-light transition hover:text-primary"
									onClick={() => handleShare(item.job_id)}
								/>
								{likedJobsMap[item.job_id] ? (
									<MdBookmark
										className="w-5 h-5 text-primary transition-all duration-200 hover:scale-110"
										onClick={() => handleToggleLike(item.job_id)}
									/>
								) : (
									<MdBookmarkBorder
										className="w-5 h-5 text-gray-400 hover:text-primary transition-all duration-200 hover:scale-110"
										onClick={() => handleToggleLike(item.job_id)}
									/>
								)}
							</div>
						</div>
						<div className="mt-4">
							<h2 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark">
								{item.company_name}
							</h2>
						</div>
						<div className="mt-1">
							<h2 className="text-base text-text-sub-light dark:text-text-sub-dark">
								{item.title}
							</h2>
							<div className="mt-4 flex flex-wrap gap-2">
								<div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${badgeStyles.salary}`}>
									<Wallet className="h-3.5 w-3.5" />
									{new Intl.NumberFormat("en-IN", {
										style: "currency",
										currency: "INR",
										maximumFractionDigits: 0,
									}).format(item.salary)}
									<span>/yr</span>
								</div>
								<div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${badgeStyles.location}`}>
									<ImLocation2 className="h-3.5 w-3.5" />
									<span>
										{item.location.state}, {item.location.city}
									</span>
								</div>
								<div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${badgeStyles.meta}`}>
									<Clock3 className="h-3.5 w-3.5" />
									<span>{item.employment_type || "Full Time"}</span>
								</div>
								{item.application_deadline ? (
									<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/12 dark:text-amber-200">
										<CalendarDays className="h-3.5 w-3.5" />
										<span>Apply by {formatDate(item.application_deadline)}</span>
									</div>
								) : null}
							</div>
						</div>
						<div className="mt-4 flex justify-end">
							<button
								className="rounded-xl bg-gradient-to-br from-primary to-primary/85 text-white px-4 py-2 text-sm font-semibold hover:brightness-105 transition-all"
							onClick={() => handleLearnMoreClick(item.job_id)}
							>
								View Details
							</button>
						</div>
					</motion.div>
				))}
			</div>
			<AnimatePresence
				onExitComplete={() => {
					setExpandedJobId(null);
					setIsClosing(false);
				}}
			>
				{expandedJobId && !isClosing && (
					<DetailJobCard
						key={expandedJobId}
						job={items.find((j) => j.job_id === expandedJobId)}
						onClose={() => setIsClosing(true)}
					/>
				)}
			</AnimatePresence>
		</>
	);
};
