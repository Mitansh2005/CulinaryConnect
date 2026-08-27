import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginTemplate from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { useUser } from "./contexts/UserContext";
import MainLayout from "./MainLayout";
import { ProfileForm } from "./components/ui/custom/profile_component/profile-form";
import { CompanyProfileForm } from "./components/ui/custom/company_profile/CompanyProfileForm";
import { LikedJobs } from "./components/ui/custom/LikedJobs";
import { getSafeUserData, setSafeUserData } from "./utils/localStorage";
import { getFreshIdToken } from "./firebase/authUtils";
import { baseUrl } from "./constants/constants";
import axios from "axios";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { ProfileTemplate } from "./pages/Profile";
import { ProfileEdit } from "./pages/ProfileEdit";
import { MessageTemplate } from "./pages/Messages";
import { ProfileBio } from "./components/ui/custom/profile_component/profile_bio";
import { Applications } from "./pages/Applications";
import PostJobForm from "./pages/PostJobs";
import { CompanyProfileTemplate } from "./pages/CompanyProfile";
import ErrorPage from "./pages/ErrorPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import JobManagement from "./pages/JobManagement";
import ApplicantDetail from "./pages/ApplicantDetail";
import { TalentExplorer } from "./pages/TalentExplorer";

function AppInner() {
  const { setUserData } = useUser();
  const { userLoggedIn } = useAuth();

  useEffect(() => {
    if (!userLoggedIn) return;

    // Fetch server-verified user data on every login/refresh.
    // This overwrites any stale or spoofed localStorage values.
    const fetchMe = async () => {
      try {
        const token = await getFreshIdToken();
        const res = await axios.get(`${baseUrl}/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        setSafeUserData(res.data);
      } catch {
        // Fall back to cached data if the network call fails
        const cached = getSafeUserData();
        if (cached) setUserData(cached);
      }
    };

    fetchMe();
  }, [userLoggedIn, setUserData]);

  return (
    <BrowserRouter basename="/">
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<LoginTemplate />} path="/login" />
          <Route
            element={<LoginTemplate initialMode="signup" />}
            path="/register"
          />

          <Route element={<MainLayout />}>
            <Route element={<Home />} path="/home" />
            <Route element={<JobDetailPage />} path="/job/:id" />
            <Route element={<JobManagement />} path="/jobs/manage" />
            <Route element={<PostJobForm />} path="/post-job" />
            <Route element={<ApplicantDetail />} path="/applicant/:id" />
            <Route element={<Applications />} path="/applications" />
            <Route element={<ProfileTemplate />} path="/profile" />
            <Route element={<ProfileEdit />} path="/edit-profile" />
            <Route
              element={<CompanyProfileTemplate />}
              path="/company-profile"
            />
            <Route
              element={<CompanyProfileForm />}
              path="/edit-company-profile"
            />
            <Route element={<ProfileBio />} path="/bio" />
            <Route element={<ProfileForm />} path="/contact_form" />
            <Route element={<MessageTemplate />} path="/messages" />
            <Route element={<LikedJobs />} path="/liked-jobs" />
            <Route element={<TalentExplorer />} path="/talent-explorer" />
            <Route element={<ErrorPage />} path="*" />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

// Wrap AppInner so it can access AuthContext
function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
