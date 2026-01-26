import { getFreshIdToken } from "@/firebase/authUtils";
import axios from "axios";
import { baseUrl } from "@/constants/constants";

export const applyForJob = async (data) => {
	try {
		const token = await getFreshIdToken(true);
		const res = await axios.post(`${baseUrl}/application/create/`,data, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return res.data;
	} catch (err) {
		console.error("Something went wrong: ", err);
		throw err.response?.data || { message: "Unexpected error occurred" };
	}
};
