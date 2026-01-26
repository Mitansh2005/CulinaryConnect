import { DetailJobCard } from "@/components/ui/custom/JobDetailNewDesign";
import { baseUrl } from "@/constants/constants";
import { getFreshIdToken } from "@/firebase/authUtils";
import axios from "axios";
export const JobShare = ({ jobId }) => {
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isClosing, setIsClosing] = useState(false);

	const fetchJob = async () => {
		try {
			setLoading(true);
			const token = await getFreshIdToken(true);
			const res = await axios.get(`${baseUrl}/jobs-detail/${jobId}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log("Job data fetched:", res.data);
			setJob(res.data);
		} catch (error) {
			console.error("Error fetching job details:", error);
			setError("Failed to load job details.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchJob();
	}, [jobId]);
	return (
		<>
			<DetailJobCard job={job} key={jobId} onClose={() => {}} />
		</>
	);
};
