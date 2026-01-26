import { JobCardDesign } from "./JobCardNewDesign";
export function  JobCards({projects}) {
	return (
		<section className="container mx-auto">
			<JobCardDesign
				items={projects}
				className="grid grid-cols-1 gap-4 sm:grid-cols-3"
			></JobCardDesign>
		</section>
	);
}
