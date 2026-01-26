import ProfilePictureUploader from "@/components/ui/custom/profile_component/profile_picture_uploader";
import CompanyIcon from "../assets/icons/company-icon.png";
import { useEffect, useState } from "react";
import { getFreshIdToken, getUid } from "@/firebase/authUtils";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
import { ImLocation2 } from "react-icons/im";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import Spinner from "@/components/ui/custom/spinner";

export const CompanyProfileTemplate = () => {
	const [currentUserId, setCurrentUserId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [companyData, setCompanyData] = useState({
		id: "",
		name: "",
		logo: CompanyIcon,
		size: 0,
		description: "",
		location: {
			country: "",
			state: "",
			city: "",
			postal_code: "",
		},
		fssaiLicenseNo: "",
		startDate: "",
	});
	const uid = getUid();
	if (!uid) {
		console.error("No user ID found. User might not be authenticated.");
		return null;
	}
	const getCurrentUserId = async () => {
		try {
			const token = await getFreshIdToken(true);
			const res = await axios.get(`${baseUrl}/profile-detail/${uid}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data.user_id;
		} catch (error) {
			console.error("Error fetching current user ID:", error);
		}
	};
	const sizeMap = {
		small: "1-50 employees",
		medium: "51-250 employees",
		large: "251-1000 employees",
		enterprise: "1000+ employees",
	};

	function getCompanySizeLabel(size) {
		return sizeMap[size] || "Not specified";
	}
	const fetchCompanyData = async (userId) => {
		try {
			setLoading(true);
			const token = await getFreshIdToken(true);
			const res = await axios.get(`${baseUrl}/company/user/${userId}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = res.data;
			console.log("Company data fetched:", data);
			if (!data) {
				console.warn("No company data found for this user.");
				return;
			} else {
				setCompanyData({
					id: data.id,
					name: data.name,
					logo: data.logo || CompanyIcon,
					size: data.size || "Not specified",
					description: data.description || "",
					location: {
						country: data.location?.country || "",
						state: data.location?.state || "",
						city: data.location?.city || "",
						postal_code: data.location?.postal_code || "",
					},
					fssaiLicenseNo: data.fssai_license_no || "",
					startDate: data.created_at || "",
				});
			}
		} catch (error) {
			console.error("Error fetching company data by userId:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		(async () => {
			try {
				const userId = await getCurrentUserId();
				if (userId) {
					setCurrentUserId(userId);
					await fetchCompanyData(userId);
				} else {
					console.warn("No user ID found from profile-detail.");
				}
			} catch (err) {
				console.error("Error in loading profile:", err);
			} finally {
				setLoading(false); // ✅ Always stop loading, even if userId is null
			}
		})();
	}, []);

	const sanitizedHtml = (data) => DOMPurify.sanitize(data);
	return (
		<>
			<section className="flex flex-col items-center h-screen overflow-hidden ">
				{loading ? (
					<div className="flex items-center justify-center h-screen -mt-10">
						<Spinner />
					</div>
				) : (
					<div className="relative flex flex-col items-center bg-white w-8/12 rounded-xl mt-8 mb-8 pb-6 px-1 shadow-md space-y-4">
						{/* Profile Uploader */}
						<ProfilePictureUploader
							id={companyData.id}
							username={companyData.name}
							defaultImage={companyData.logo}
							getProfileUrl={`${baseUrl}/company`}
							uploadUrl={`${baseUrl}/company/upload-logo/${companyData.id}/`}
							className="pb-3 "
						/>
						<div className="w-full border-t border-beige-400 -mt-36"></div>

						{/* Company description */}
						<p className="text-base text-beige-100 max-w-2xl text-center leading-relaxed">
							<span
								dangerouslySetInnerHTML={{
									__html:
										sanitizedHtml(companyData.description) || "Description Not Available",
								}}
							/>
						</p>

						{/* Details grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl text-gray-700">
							<div className="flex flex-col p-4 bg-beige-700 rounded-lg space-y-1">
								<span className="text-xs text-beige-100">FSSAI License</span>
								<span className="text-base font-medium">
									{companyData.fssaiLicenseNo}
								</span>
							</div>
							<div className="flex flex-col p-4 bg-beige-700 rounded-lg space-y-1">
								<span className="text-xs text-beige-100">Company Size</span>
								<span className="text-base font-medium">
									{getCompanySizeLabel(companyData.size)}
								</span>
							</div>
							<div className="flex flex-col p-4 bg-beige-700 rounded-lg space-y-1">
								<span className="text-xs text-beige-100">Location</span>
								<span className="text-base font-medium flex items-center gap-1">
									<ImLocation2 className="text-beige-100" />
									{companyData.location?.country || "Not specified"},{" "}
									{companyData.location?.state || "Not specified"},{" "}
									{companyData.location?.city || "Not specified"},{" "}
									{companyData.location?.postal_code || "Not specified"}
								</span>
							</div>
							<div className="flex flex-col p-4 bg-beige-700 rounded-lg space-y-1">
								<span className="text-xs text-beige-100">Founded</span>
								<span className="text-base font-medium">
									{companyData.startDate?.split("T")[0]}
								</span>
							</div>
						</div>

						{/* Divider */}
						<div className="w-full border-t border-beige-400 pt-5"></div>

						{/* Edit button at bottom-right */}
						<div className="flex justify-end w-full max-w-3xl">
							<Link to="/edit-company-profile" state={{ companyData }}>
								<button className="px-4 py-2 bg-beige-200 text-white rounded-sm shadow hover:bg-beige-200/90 transition text-base">
									Edit Profile
								</button>
							</Link>
						</div>
					</div>
				)}
			</section>
		</>
	);
};
