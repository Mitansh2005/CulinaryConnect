import axios from "axios";
import { auth } from "./firebase";
import { baseUrl } from "@/constants/constants";
export const getFreshIdToken = async () => {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");
	console.log(user.getIdToken(true));
	return await user.getIdToken(true); // true = force refresh
};

export const getUid = () => {
	return auth.currentUser?.uid;
};

export const setUpProfile = async ({
	uid,
	username,
	user_type,
	company_name,
	fssai_license_no,
}) => {
	console.log("Api call working ");
	console.log(
		"Data being transferred:" + uid,
		username,
		user_type,
		company_name,
		fssai_license_no
	);
	try {
		const token = await getFreshIdToken(true);
		const response = await axios.post(
			`${baseUrl}/auth/setup-profile/`,
			{
				uid,
				username,
				user_type,
				company_name,
				fssai_license_no,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		console.log("Profile setup successful:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"Profile setup failed:",
			error.response?.data || error.message
		);
		throw error;
	}
};
