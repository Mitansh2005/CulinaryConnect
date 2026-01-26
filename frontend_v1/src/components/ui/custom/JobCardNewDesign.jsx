import { IoShareSocial } from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import DefaultLogo from "../../../assets/icons/restaurant.png";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { DetailJobCard } from "./JobDetailNewDesign";
import { motion, AnimatePresence } from "framer-motion";
import { getFreshIdToken } from "@/firebase/authUtils";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
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
			<div className={("grid grid-cols-4 gap-2 mt-16 p-4 w-full", className)}>
				{items.map((item, idx) => (
					<motion.div
						layoutId={`job-${item.job_id}`} // 🧠 Unique ID used to "link" animations
						key={item.job_id}
						className={`relative bg-brandPrimary mt-10 bg-gradient-to-br from-brandPrimary to-gray-100 p-6 rounded-xl shadow-2xl border border-gray-200 transition-opacity duration-200 ${
							expandedJobId === item.job_id
								? "opacity-0 pointer-events-none"
								: "opacity-100"
						}`}
					>
						<div className="p-4 flex justify-between items-stretch mt-[-11px]">
							<img
								loading="lazy"
								src={`data:image/jpeg;base64,${item.company_logo?.replace(/\s/g, "")}`}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = DefaultLogo;
								}}
								alt="Company Logo"
								className="h-14 w-14 object-cover  rounded-full"
							/>

							<div className="flex justify-between w-fit mt-1 mr-[-15px] cursor-pointer">
								<IoShareSocial
									className="w-10"
									onClick={() => handleShare(item.job_id)}
								/>
								{likedJobsMap[item.job_id] ? (
									<AiFillStar
										className="w-10 text-yellow-500"
										onClick={() => handleToggleLike(item.job_id)}
									/>
								) : (
									<AiOutlineStar
										className="w-10"
										onClick={() => handleToggleLike(item.job_id)}
									/>
								)}
							</div>
						</div>
						<div className="ml-4">
							<h2 className="font-customFont3 font-semibold text-xl">
								{item.company_name}
							</h2>
						</div>
						<div className="mt-[-4px] ml-4">
							<h2 className="font-customFont3 text-gray-600 text-lg">
								{item.title}
							</h2>
							<h2 className="mt-4 font-customFont3 ">
								{new Intl.NumberFormat("en-IN", {
									style: "currency",
									currency: "INR",
									maximumFractionDigits: 0,
								}).format(item.salary)}
								/yr
							</h2>
							<div className="font-customFont3 text-base text-gray-500 flex items-center mt-3">
								<ImLocation2 />
								<h4 className="ml-1 mt-1">
									{item.location.state}, {item.location.city},{" "}
									{item.location.postal_code}
								</h4>
							</div>
						</div>
						{/* 👇 Bottom Right Button */}
						<button
							className="absolute bottom-6 right-6 bg-brandAccent text-white px-4 py-2 rounded-lg shadow hover:bg-[#0c6391c9] transition-all"
							onClick={() => handleLearnMoreClick(item.job_id)}
						>
							Learn More
						</button>
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
