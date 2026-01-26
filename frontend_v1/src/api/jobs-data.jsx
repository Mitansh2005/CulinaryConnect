import { useState, useEffect } from "react";
import axios from "axios";
import { getFreshIdToken } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
export const useJobs = () => {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // better to use null here
	useEffect(() => {
		console.log("Fetching jobs...");
		const fetchData = async () => {
			const token = await getFreshIdToken(true);
			try {
				console.log("Calling API...");
				const res = await axios.get(`${baseUrl}/jobs/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log("working ");
				setJobs(res.data);
			} catch (e) {
				setError("Something went wrong: " + e.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return { jobs, loading, error };
};

export const useJobDetails = (jobId) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if(!jobId) return;
			const fetchData = async () => {
				try {
					const token = await getFreshIdToken(true);
					if (token) {
						const res = await axios.get(`${baseUrl}/jobs-detail/${jobId}/`, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
						setData(res.data);
					}
				} catch (e) {
					console.error("Fetch error:", e);
					setError("Something went wrong: " + e.message);
				} finally {
					setLoading(false);
				}
			};

			if (jobId) {
				fetchData();
			}
	}, [jobId]);

	return { data, loading, error };
};
