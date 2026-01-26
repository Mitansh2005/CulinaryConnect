// LikedJobs.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getFreshIdToken } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import { useNavigate } from "react-router-dom";
import { JobCardDesign } from "./JobCardNewDesign";
import Spinner from "./spinner";

export function LikedJobs() {
	const [likedJobs, setLikedJobs] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
  const [refreshKey,setRefreshKey] = useState(0);

	useEffect(() => {
		const fetchLikedJobs = async () => {
			setLoading(true);
			try {
				const token = await getFreshIdToken(true);
				const res = await axios.get(`${baseUrl}/jobseeker/liked-jobs/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLikedJobs(res.data);
				console.log("Liked jobs fetched:", res.data);
			} catch (error) {
				console.error("Failed to fetch liked jobs:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLikedJobs();
	}, [refreshKey]);

  const triggerRefresh = () => setRefreshKey((prev)=> prev+1);
	return (
		<div>
			{loading ? (
				<div className="flex justify-center items-center w-full h-[70vh]">
					<div className="backdrop-blur-sm shadow-lg bg-black bg-opacity-40 w-6/12 text-center rounded-2xl font-bold p-6 flex items-center justify-center">
						<h2 className="mr-5 text-white text-lg">Fetching the Data......</h2>
						<Spinner />
					</div>
				</div>
			) : likedJobs.length === 0 ? (
				<>
					<div className="flex flex-col items-center justify-center h-full mt-10">
						<h2 className="text-2xl font-semibold mb-4">
							You haven't liked any jobs yet.
						</h2>
						<button
							className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
							onClick={() => navigate("/home")}
						>
							Browse Jobs
						</button>
					</div>
				</>
			) : (
				<div className="max-w-4xl mx-auto mt-10 px-6">
					<h1 className="text-3xl font-bold mb-6 text-center">💙 Liked Jobs</h1>
					<JobCardDesign items={likedJobs} triggerRefresh={triggerRefresh}/>
				</div>
			)}
		</div>
	);
}
