import { useState, useEffect } from "react";
import {
	doCreateUserWithEmailPassword,
	doSignInWithGoogle,
} from "@/firebase/auth";
import { Button } from "../ui/button";
import loginImg from "../../assets/images/login_page.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import {
	InputComponent,
	PasswordInputComponent,
} from "../ui/custom/input-component";
import { getUid, setUpProfile } from "@/firebase/authUtils";
import { auth } from "@/firebase/firebase";
import Spinner from "../ui/custom/spinner";
export function RegisterTemplate() {
	const navigate = useNavigate();
	const [profileSetUpComplete, setProfileSetUpComplete] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmpassword, setConfirmPassword] = useState("");
	const [isRegisterIn, setIsRegisterIn] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [userType, setUserType] = useState("chef"); // default is chef
	const [companyName, setCompanyName] = useState("");
	const [fssaiLicense, setFssaiLicense] = useState("");
	const [formValid, setFormValid] = useState(false);
	const { userLoggedIn } = useAuth();
	const [showRecruiterModal, setShowRecruiterModal] = useState(false);

	useEffect(() => {
		if (userLoggedIn && profileSetUpComplete) {
			navigate("/home");
		}
	}, [userLoggedIn, profileSetUpComplete, navigate]);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!isRegisterIn && checkFunction() && formValid) {
			setIsRegisterIn(true);
			try {
				setLoading(true);
				await doCreateUserWithEmailPassword(email, password);
				const uid = getUid();
				try {
					const res = await setUpProfile({
						uid: uid,
						username: "New User",
						user_type: userType,
						company_name: companyName || null,
						fssai_license_no: fssaiLicense || null,
					});
					console.log(res);
					// Store userType for home page role detection
					localStorage.setItem('userType', userType);
				} catch (err) {
					setErrorMessage("Something went wrong while creating profile !");
					const user = auth.currentUser;
					if (user) {
						await user.delete(); // This removes user from Firebase
					}
				}

				setProfileSetUpComplete(true);
				// localStorage.setItem("userId",)
				console.log("Token verified and user logged in");
			} catch (err) {
				// Rollback Firebase user if profile setup fails
				const currentUser = auth.currentUser;
				if (currentUser) {
					await currentUser.delete(); // This removes user from Firebase
				}
				console.error(err);
				setErrorMessage(err.message);
			} finally {
				setIsRegisterIn(false);
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		// This runs whenever userType, companyName, or fssaiLicense changes
		const valid = isFormValid();
		setFormValid(valid);
	}, [userType, companyName, fssaiLicense]);

	const isFormValid = () => {
		if (!userType) return false;

		if (userType === "restaurant") {
			return companyName.trim() !== "" && fssaiLicense.trim() !== "";
		}

		// Add more rules per userType if needed
		return true;
	};
	const handleGoogleSignIn = (e) => {
		e.preventDefault();
		if (userType === "restaurant") {
			setShowRecruiterModal(true);
		} else {
			onGoogleSignIn();
		}
	};

	const onGoogleSignIn = async (e) => {
		e.preventDefault();
		if (!isRegisterIn) {
			setIsRegisterIn(true);
			try {
				setLoading(true);
				await doSignInWithGoogle();
				const uid = getUid();
				console.log(userType);
				try {
					await setUpProfile({
						uid: uid,
						username: "New User",
						user_type: userType,
						company_name: companyName || null,
						fssai_license_no: fssaiLicense || null,
					});
				} catch (err) {
					setErrorMessage("Something went wrong: " + err.message);
					const user = auth.currentUser;
					if (user) {
						await user.delete(); // This removes user from Firebase
					}
				}
				// Store userType for home page role detection
				localStorage.setItem('userType', userType);
				setProfileSetUpComplete(true);
				console.log("Token verified and user logged in");
			} catch (err) {
				setErrorMessage("Something went wrong: " + err.message);
				const currentUser = auth.currentUser;
				if (currentUser) {
					await currentUser.delete(); // This removes user from Firebase
				}
			} finally {
				setIsRegisterIn(false);
				setShowRecruiterModal(false);
				setLoading(false);
			}
		}
	};

	const togglePasswordVisibility = (e) => {
		e.preventDefault();
		setPasswordVisible(!passwordVisible);
	};

	const checkFunction = (e) => {
		if (password == confirmpassword) {
			return true;
		}
		setErrorMessage("Both fields should be same");
		return false;
	};
	return (
		<>
			<section className="flex items-center justify-center">
				{/* login container */}
				<div className="bg-gray-200 flex rounded-2xl shadow-lg max-w-3xl px-16 py-5 mt-9 items-center">
					{showRecruiterModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-white p-6 rounded-lg shadow-lg w-96">
								<h3 className="text-xl font-semibold mb-4">
									Recruiter Details
								</h3>
								<div className="flex flex-col gap-3">
									<input
										type="text"
										placeholder="Company Name"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										className="border px-3 py-2 rounded"
									/>
									<input
										type="text"
										placeholder="FSSAI License"
										value={fssaiLicense}
										onChange={(e) => setFssaiLicense(e.target.value)}
										className="border px-3 py-2 rounded"
									/>
									<div className="flex justify-end gap-2 mt-4">
										<button
											onClick={() => setShowRecruiterModal(false)}
											className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
										>
											Cancel
										</button>
										<button
											onClick={(e) => onGoogleSignIn(e)}
											className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
										>
											Continue
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* form */}
					<div className=" px-20">
						<h2 className="font-black text-5xl text-[#615519]">SIGN UP</h2>
						<p className="text-sm mt-4 text-[#9a8a38]">
							To Become A Member Sign Up Here
						</p>
						<div className="flex gap-4 my-4">
							<Button
								variant={userType === "chef" ? "default" : "outline"}
								onClick={() => setUserType("chef")}
							>
								I am a Jobseeker
							</Button>
							<Button
								variant={userType === "restaurant" ? "default" : "outline"}
								onClick={() => setUserType("restaurant")}
							>
								I am a Recruiter
							</Button>
						</div>

						<form
							action=""
							onSubmit={onSubmit}
							className="flex flex-col gap-4 w-full"
						>
							{errorMessage && (
								<div className="bg-red-300 px-3 py-2 w-fit mb-[-8px] ml-3 rounded-md text-red-700 mt-4">
									{errorMessage}
								</div>
							)}
							<InputComponent
								type="text"
								name="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								isRequired={true}
							></InputComponent>
							<PasswordInputComponent
								name="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								btnOnClick={togglePasswordVisibility}
								passwordVisiblity={passwordVisible}
							></PasswordInputComponent>
							<PasswordInputComponent
								name="confirmPassword"
								placeholder="Confirm Password"
								value={confirmpassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								btnOnClick={togglePasswordVisibility}
								passwordVisiblity={passwordVisible}
							></PasswordInputComponent>

							{/* Recruiter-only fields */}
							{userType === "restaurant" && (
								<>
									<InputComponent
										type="text"
										name="company"
										placeholder="Company Name"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										isRequired={true}
									/>
									<InputComponent
										type="text"
										name="fssai_license_no"
										placeholder="FSSAI License No"
										value={fssaiLicense}
										onChange={(e) => setFssaiLicense(e.target.value)}
										isRequired={true}
									/>
								</>
							)}

							<Button variant="default" onClick={onSubmit} disabled={loading}>
								{loading ? "Signing up..." : "Sign Up"}
							</Button>
							{/* <button className=" w-fit text-sm italic text-blue-500 hover:text-base hover:text-blue-700 decoration-sky-500 duration-75 ease-linear">
								Forgot Password
							</button> */}
						</form>
						<div className="mt-4 grid grid-cols-3 items-center text-grey-100">
							<hr className="border-gray-500"></hr>
							<p className="text-center text-sm">Or</p>
							<hr className="border-gray-500"></hr>
						</div>
						{/* google sign in options  */}
						<button
							className={`bg-white w-full py-2 rounded-xl mt-3 flex justify-center items-center hover:shadow-xl ease-linear duration-200 ${loading ? "opacity-60 cursor-not-allowed" : ""
								}`}
							onClick={(e) => handleGoogleSignIn(e)}
							disabled={loading}
						>
							{loading ? (
								<Spinner />
							) : (
								<>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-3"
										viewBox="0 0 48 48"
										width="25px"
										height="25px"
									>
										<path
											fill="#FFC107"
											d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
										/>
										<path
											fill="#FF3D00"
											d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
										/>
										<path
											fill="#4CAF50"
											d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
										/>
										<path
											fill="#1976D2"
											d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
										/>
									</svg>
									<p className="text-base text-center">Login with Google</p>
								</>
							)}
						</button>

						<div className="flex mt-4 justify-between ">
							<p className="text-sm mr-2"> Have A Account? Click Here</p>
							<Link to="/login">
								<Button>SignIn</Button>
							</Link>
						</div>
					</div>

					{/* image */}
					<div className="sm:block hidden w-1/2 ml-7">
						<img
							className="rounded-2xl h-auto"
							src={loginImg}
							alt="login-img"
						></img>
					</div>
				</div>
			</section>
		</>
	);
}
