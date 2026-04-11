import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useUser } from "@/UserContext";
import { ImCross } from "react-icons/im";
import { Button } from "../../button";
import { NormalButtons } from "../../ui_buttons";
import { getFreshIdToken, getUid } from "@/firebase/authUtils";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
import ReactQuill from "react-quill";

export function ProfileBio() {
	const [bio, setBio] = useState("");
	const { userData, setUserData } = useUser();
	const [errorData, setErrorData] = useState("");
	const [loading, setLoading] = useState(true);
	const [popupType, setPopupType] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const navigate = useNavigate();
	const uid = getUid();
	useEffect(() => {
		const fetchBio = async () => {
			try {
				setLoading(true);
				const token = await getFreshIdToken(true);
				const res = await axios.get(`${baseUrl}/profile-detail/${uid}/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = res.data;
				setBio(data.bio);
				setPopupType("success");
			} catch (err) {
				console.error("Something went wrong in fetching the bio.", err);
				setErrorData(err);
				setPopupType("error");
			} finally{
				setLoading(false);
			}
		};
		if (uid) {
			fetchBio();
		}
	}, [uid]);
	const saveUserData = (data) => {
		setUserData(data); // Update context
		localStorage.setItem("userData", JSON.stringify(data)); // Save to localStorage
	};
	const saveBio = async () => {
		try {
			setLoading(true);
			const token = await getFreshIdToken(true);
			const res = await axios.put(
				`${baseUrl}/profile-detail/${uid}/`,
				{ bio },
				{
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log("Profile updated:", res.data);
			setBio(res.data.bio);
			saveUserData(res.data);
			setPopupType("success");
		} catch (error) {
			console.error("Something went wrong updating profile.", error);
			setErrorData(error);
			setPopupType("error");
		}finally{
			setLoading(false);
			setShowPopup(true);
		}
	};

	const updateBio = (e) => {
		setBio(e.target.value);
	};

	const closePopup = () => {
		setShowPopup(false);
		navigate("/profile");
	};

	return (
		<>
			<section className="flex flex-col items-center overflow-hidden ">
				{showPopup && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg text-center">
							<div className="flex justify-end mt-{-4px}">
								<ImCross
									className="hover:text-red-600 hover:cursor-pointer"
									onClick={closePopup}
								></ImCross>
							</div>
							<h2
								className={`text-xl font-semibold mb-4 ${
									popupType === "success" ? "text-green-600" : "text-red-600"
								}`}
							>
								{popupType === "success" ? "Success!" : "Failed!"}
							</h2>
							<p>
								{popupType === "success"
									? "The process completed successfully."
									: errorData?.message || "Something went wrong."}
							</p>
							<Button
								onClick={closePopup}
								className="mt-4 px-4 py-1 hover:bg-red-500 hover:text-black rounded-md"
							>
								Close
							</Button>
						</div>
					</div>
				)}
				<div className="flex flex-col bg-slate-100 w-6/12 rounded-sm mt-10 p-4">
					<Link to="/profile">
						<FaArrowLeft className="mb-3 text-lg hover:cursor-pointer hover:text-red-600 " />
					</Link>
					<label className="text-3xl mb-3 ml-1">Bio</label>
					<ReactQuill
						value={loading ? "Loading..." : bio || ""}
						onChange={(content) => setBio(content)}
						disabled={loading}
						className="w-full h-auto resize-none outline-none overflow-auto p-2 duration-75 ease-linear rounded-md focus:border-b-4 border-brandPrimary transition-all text-xl"
						placeholder="Tell employer more about yourself here"
					/>
					<div className="flex justify-end mt-3">
						<NormalButtons onClick={saveBio}></NormalButtons>
					</div>
				</div>
			</section>
		</>
	);
}
