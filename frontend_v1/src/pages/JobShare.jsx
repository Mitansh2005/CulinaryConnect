import { useState } from "react";
import { DetailJobCard } from "@/components/ui/custom/JobDetailNewDesign";
import { useJobDetails } from "@/api/jobs-data";
import Spinner from "@/components/ui/custom/spinner";

export const JobShare = ({ jobId }) => {
	const { data: job, isLoading, isError } = useJobDetails(jobId);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (isError || !job) {
		return (
			<div className="flex h-screen items-center justify-center text-red-500">
				Failed to load job details.
			</div>
		);
	}

	return <DetailJobCard job={job} key={jobId} onClose={() => {}} />;
};
