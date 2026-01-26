// src/pages/JobDetailPage.jsx
import { useParams } from "react-router-dom";
import { useJobDetails } from "@/api/jobs-data";
import { DetailJobCard } from "@/components/ui/custom/JobDetailNewDesign";
import Spinner from "@/components/ui/custom/spinner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
export const JobDetailPage = () => {
	const { id } = useParams();
	const { data, loading, error } = useJobDetails(id);
  const navigate = useNavigate();
  console.log(data);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spinner />
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="text-center mt-10">
				<h2 className="text-2xl font-semibold text-red-600">Job Not Found</h2>
				<p className="text-white">{error}</p>
        <p className="text-white">Click below to login</p>
        <Button className="hover:bg-green-500 ease-linear duration-150 hover:text-black" onClick={() => navigate('/login')} >Login</Button>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto mt-10 px-6">
			<DetailJobCard job={data} onClose={() => navigate('/home')} />
		</div>
	);
};
