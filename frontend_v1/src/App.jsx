import "./App.css";
import LoginTemplate from "./components/auth/login";
import { RegisterTemplate } from "./components/auth/register";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	BrowserRouter,
} from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Home from "./pages/Home";
import { useUser } from "./UserContext";
import { useEffect } from "react";
import { ProfileTemplate } from "./pages/Profile";
import { ProfileForm } from "./components/ui/custom/profile_component/profile-form";
import { MessageTemplate } from "./pages/Messages";
import { ProfileBio } from "./components/ui/custom/profile_component/profile_bio";
import { JobCardDesign } from "./components/ui/custom/JobCardNewDesign";
import { Applications } from "./pages/Applications";
import MainLayout from "./MainLayout";
import PostJobForm from "./pages/PostJobs";
import { CompanyProfileTemplate } from "./pages/CompanyProfile";
import { CompanyProfileForm } from "./components/ui/custom/company_profile/CompanyProfileForm";
import ErrorPage from "./pages/ErrorPage";
import { LikedJobs } from "./components/ui/custom/LikedJobs";
import { DetailJobCard } from "./components/ui/custom/JobDetailNewDesign";
import { JobDetailPage } from "./pages/JobDetailPage";
import { getSafeUserData } from "./utils/localStorage";
import JobManagement from "./pages/JobManagement";
import ApplicantDetail from "./pages/ApplicantDetail";

function App() {
	const { userData, setUserData } = useUser();
	useEffect(() => {
		const savedUserData = getSafeUserData();
		if (savedUserData) {
			setUserData(savedUserData); // Load data into the context
		}
	}, [setUserData]);
	return (
		<>
			<div className="bg-tea_green-900 max-h-full">
				{/* <Navbar/> */}
				<AuthProvider>
					<BrowserRouter basename="/">
						<Routes>
							<Route path="/" element={<Home />}></Route>
							<Route path="/login" element={<LoginTemplate />}></Route>
							<Route path="/register" element={<RegisterTemplate />}></Route>
							<Route element={<MainLayout />}>
								<Route path="/home" element={<Home />}></Route>
								<Route path="/job/:id" element={<JobDetailPage />} />
								<Route path="/jobs/manage" element={<JobManagement />} />
								<Route path="/post-job" element={<PostJobForm />}></Route>
								<Route path="/applicant/:id" element={<ApplicantDetail />} />
								<Route path="/applications" element={<Applications />}></Route>
								<Route path="/profile" element={<ProfileTemplate />}></Route>
								<Route path="/company-profile" element={<CompanyProfileTemplate />}></Route>
								<Route path="/edit-company-profile" element={<CompanyProfileForm />}></Route>
								<Route path="/bio" element={<ProfileBio />}></Route>
								<Route path="/contact_form" element={<ProfileForm />}></Route>
								<Route path="/messages" element={<MessageTemplate />}></Route>
								<Route path="/liked-jobs" element={<LikedJobs />}></Route>
								<Route path="/dev" element={<JobCardDesign />}></Route>
								<Route path="*" element={<ErrorPage />}></Route>
							</Route>
						</Routes>
					</BrowserRouter>
				</AuthProvider>
			</div>
		</>
	);
}

export default App;
