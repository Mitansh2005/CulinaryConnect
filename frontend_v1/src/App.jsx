import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginTemplate from "./components/auth/login";
import { AuthProvider } from "./contexts/authContext";
import { useUser } from "./UserContext";
import MainLayout from "./MainLayout";
import { ProfileForm } from "./components/ui/custom/profile_component/profile-form";
import { CompanyProfileForm } from "./components/ui/custom/company_profile/CompanyProfileForm";
import { LikedJobs } from "./components/ui/custom/LikedJobs";
import { JobCardDesign } from "./components/ui/custom/JobCardNewDesign";
import { getSafeUserData } from "./utils/localStorage";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { ProfileTemplate } from "./pages/Profile";
import { MessageTemplate } from "./pages/Messages";
import { ProfileBio } from "./components/ui/custom/profile_component/profile_bio";
import { Applications } from "./pages/Applications";
import PostJobForm from "./pages/PostJobs";
import { CompanyProfileTemplate } from "./pages/CompanyProfile";
import ErrorPage from "./pages/ErrorPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import JobManagement from "./pages/JobManagement";
import ApplicantDetail from "./pages/ApplicantDetail";

function App() {
  const { setUserData } = useUser();

  useEffect(() => {
    const savedUserData = getSafeUserData();
    if (savedUserData) {
      setUserData(savedUserData);
    }
  }, [setUserData]);

  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<LoginTemplate />} path="/login" />
          <Route element={<LoginTemplate initialMode="signup" />} path="/register" />

          <Route element={<MainLayout />}>
            <Route element={<Home />} path="/home" />
            <Route element={<JobDetailPage />} path="/job/:id" />
            <Route element={<JobManagement />} path="/jobs/manage" />
            <Route element={<PostJobForm />} path="/post-job" />
            <Route element={<ApplicantDetail />} path="/applicant/:id" />
            <Route element={<Applications />} path="/applications" />
            <Route element={<ProfileTemplate />} path="/profile" />
            <Route element={<CompanyProfileTemplate />} path="/company-profile" />
            <Route element={<CompanyProfileForm />} path="/edit-company-profile" />
            <Route element={<ProfileBio />} path="/bio" />
            <Route element={<ProfileForm />} path="/contact_form" />
            <Route element={<MessageTemplate />} path="/messages" />
            <Route element={<LikedJobs />} path="/liked-jobs" />
            <Route element={<JobCardDesign items={[]} />} path="/dev" />
            <Route element={<ErrorPage />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
