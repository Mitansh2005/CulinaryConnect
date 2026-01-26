import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import GoogleIcon from "../../assets/icons/google.png";
import {
  doSignInWithGoogle,
  doSignInWithEmailPassword,
  doCreateUserWithEmailPassword,
} from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { getFreshIdToken, getUid, setUpProfile } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import { MdErrorOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function LoginTemplate() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [userType, setUserType] = useState("restaurant"); // default is restaurant
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [fssaiLicense, setFssaiLicense] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // or "signup"
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegisterIn, setIsRegisterIn] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [profileSetUpComplete, setProfileSetUpComplete] = useState(false);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (userLoggedIn) {
      // If signing up, wait for profile setup
      if (authMode === "signup" && !profileSetUpComplete) {
        return;
      }
      // Otherwise redirect immediately
      navigate("/home");
    }
  }, [userLoggedIn, profileSetUpComplete, authMode, navigate]);

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
    return true;
  };

  const onSubmit = async (e, mode) => {
    e.preventDefault();
    if (mode === "signup") {
      if (!isRegisterIn && checkFunction() && formValid) {
        setIsRegisterIn(true);
        try {
          setSubmitLoading(true);
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
            localStorage.setItem("userData", JSON.stringify(res.data));
          } catch (err) {
            setProfileSetUpComplete(false);
            setErrorMessage("Something went wrong while creating profile!");
            const user = auth.currentUser;
            if (user) {
              await user.delete(); // This removes user from Firebase
            }
          }
          setProfileSetUpComplete(true);
          console.log("Token verified and user logged in");
        } catch (err) {
          // Rollback Firebase user if profile setup fails
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.delete(); // This removes user from Firebase
          }
          console.error(err);
          setErrorMessage("Please try again with correct email and password!");
        } finally {
          setIsRegisterIn(false);
          setSubmitLoading(false);
        }
      }
    } else {
      console.log(mode);
      if (!isSigningIn) {
        setIsSigningIn(true);
        try {
          setSubmitLoading(true);

          await doSignInWithEmailPassword(email, password);

          const typeMatch = await checkUserType(userType);
          if (!typeMatch) {
            await auth.signOut();
            setErrorMessage("User type does not match. Please try again.");
            return;
          }
          console.log("Token verified and user logged in");
          localStorage.setItem("userType", userType);
          setProfileSetUpComplete(true); // Trigger navigation to home
        } catch (err) {
          setErrorMessage("Try again with correct email and password!");
        } finally {
          setIsSigningIn(false);
          setSubmitLoading(false);
        }
      }
    }
  };

  const checkUserType = async (selectedType) => {
    console.log("Checking user type...");
    try {
      const uid = getUid();
      if (!uid) {
        throw new Error("User not authenticated");
      }
      const token = await getFreshIdToken(true);
      const res = await axios.get(`${baseUrl}/profile-detail/${uid}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dbType = res.data.user_type;
      console.log(dbType, selectedType); // adjust according to your API's response
      if (dbType !== selectedType) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking user type:", error);
    }
  };

  const onGoogleAuth = async (mode) => {
    if (mode === "signup") {
      if (!isRegisterIn && formValid) {
        setIsRegisterIn(true);
        try {
          setGoogleLoading(true);
          await doSignInWithGoogle();
          const uid = getUid();
          console.log(userType);
          try {
            const res = await setUpProfile({
              uid: uid,
              username: "New User",
              user_type: userType,
              company_name: companyName || null,
              fssai_license_no: fssaiLicense || null,
            });
            localStorage.setItem("userData", res.data);
          } catch (err) {
            setProfileSetUpComplete(false);
            setErrorMessage("Something went wrong: " + err.message);
            const user = auth.currentUser;
            if (user) {
              await user.delete(); // This removes user from Firebase
            }
          }
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
          setGoogleLoading(false);
        }
      }
    } else {
      if (!isSigningIn) {
        setIsSigningIn(true);
        try {
          setGoogleLoading(true);

          await doSignInWithGoogle();

          const typeMatch = await checkUserType(userType);

          if (!typeMatch) {
            await auth.signOut();
            setErrorMessage("User type does not match. Please try again.");
            return;
          }
          console.log("Token verified and user logged in");
          localStorage.setItem("userType", userType);
          setProfileSetUpComplete(true); // Trigger navigation to home
        } catch (err) {
          setErrorMessage("Something went wrong. Please try again!");
        } finally {
          setIsSigningIn(false);
          setGoogleLoading(false);
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
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
      <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
        {/* Left Section: Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-background-dark max-w-[640px] w-full mx-auto lg:mx-0 shadow-xl lg:shadow-none z-10">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-black font-bold text-xl">
                    restaurant
                  </span>
                </div>
                <span className="text-xl font-bold tracking-tight text-black dark:text-white">
                  Culinary Connect
                </span>
              </div>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#111813] dark:text-white">
                {authMode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Connect with top talent or find your next kitchen.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                <div className="flex">
                  <MdErrorOutline className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-200">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Role Switcher */}
            <div className="mb-8">
              <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f0f4f2] dark:bg-white/5 p-1">
                <label className="group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all has-[:checked]:bg-primary has-[:checked]:shadow-sm">
                  <span className="truncate text-sm font-medium text-gray-600 dark:text-gray-300 group-has-[:checked]:text-[#111813]">
                    Restaurant
                  </span>
                  <input
                    checked={userType === "restaurant"}
                    onChange={() => setUserType("restaurant")}
                    className="invisible w-0"
                    name="role-selection"
                    type="radio"
                    value="restaurant"
                  />
                </label>
                <label className="group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all has-[:checked]:bg-primary has-[:checked]:shadow-sm">
                  <span className="truncate text-sm font-medium text-gray-600 dark:text-gray-300 group-has-[:checked]:text-[#111813]">
                    Chef
                  </span>
                  <input
                    checked={userType === "chef"}
                    onChange={() => setUserType("chef")}
                    className="invisible w-0"
                    name="role-selection"
                    type="radio"
                    value="chef"
                  />
                </label>
              </div>
            </div>

            {/* Main Form */}
            <motion.form
              layout
              onSubmit={(e) => onSubmit(e, authMode)}
              className="space-y-6"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium leading-6 text-[#111813] dark:text-gray-200"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-[#111813] dark:text-white bg-white dark:bg-white/5 ring-1 ring-inset ring-[#dbe6df] dark:ring-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    id="email"
                    name="email"
                    placeholder="name@restaurant.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field(s) - Side by side in signup mode */}
              <div
                className={`${authMode === "signup" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-sm font-medium leading-6 text-[#111813] dark:text-gray-200"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    {authMode === "signin" && (
                      <div className="text-sm">
                        <a
                          className="font-medium text-[#111813] hover:text-primary dark:text-[#0fdc53] hover:underline transition-colors"
                          href="#"
                        >
                          Forgot password?
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-[#111813] dark:text-white bg-white dark:bg-white/5 ring-1 ring-inset ring-[#dbe6df] dark:ring-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {passwordVisible ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Signup Only) */}
                {authMode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-2"
                  >
                    <label
                      className="block text-sm font-medium leading-6 text-[#111813] dark:text-gray-200"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-gray-400 text-[20px]">
                          lock
                        </span>
                      </div>
                      <input
                        className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-[#111813] dark:text-white bg-white dark:bg-white/5 ring-1 ring-inset ring-[#dbe6df] dark:ring-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {confirmPasswordVisible
                            ? "visibility_off"
                            : "visibility"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Restaurant extra fields */}
              <AnimatePresence mode="wait">
                {userType === "restaurant" && authMode === "signup" && (
                  <motion.div
                    key="restaurant_fields"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <label
                        className="block text-sm font-medium leading-6 text-[#111813] dark:text-gray-200"
                        htmlFor="companyName"
                      >
                        Company Name
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <input
                          className="block w-full rounded-lg border-0 py-3 px-3 text-[#111813] dark:text-white bg-white dark:bg-white/5 ring-1 ring-inset ring-[#dbe6df] dark:ring-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                          id="companyName"
                          name="companyName"
                          placeholder="Your Restaurant Name"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-sm font-medium leading-6 text-[#111813] dark:text-gray-200"
                        htmlFor="fssaiLicense"
                      >
                        FSSAI License No
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <input
                          className="block w-full rounded-lg border-0 py-3 px-3 text-[#111813] dark:text-white bg-white dark:bg-white/5 ring-1 ring-inset ring-[#dbe6df] dark:ring-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                          id="fssaiLicense"
                          name="fssaiLicense"
                          placeholder="FSSAI License Number"
                          type="text"
                          value={fssaiLicense}
                          onChange={(e) => setFssaiLicense(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <div>
                <button
                  className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-bold leading-6 text-[#111813] shadow-sm hover:bg-[#0fdc53] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={submitLoading || googleLoading}
                >
                  {submitLoading
                    ? "Loading..."
                    : authMode === "signin"
                      ? "Log In"
                      : "Sign Up"}
                </button>
              </div>
            </motion.form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white dark:bg-background-dark px-6 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-6">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-white/5 px-3 py-3 text-sm font-semibold text-[#111813] dark:text-white shadow-sm ring-1 ring-inset ring-[#dbe6df] dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:ring-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => onGoogleAuth(authMode)}
                  disabled={googleLoading || submitLoading}
                  type="button"
                >
                  {googleLoading ? (
                    <div className="animate-spin border-4 border-t-transparent rounded-full w-6 h-6 border-primary" />
                  ) : (
                    <>
                      <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                      <span className="text-sm">Google</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Mode Toggle */}
            <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
              {authMode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                className="font-bold leading-6 text-[#111813] hover:text-primary dark:text-[#0fdc53] hover:underline transition-colors ml-1"
                onClick={() => {
                  setAuthMode(authMode === "signin" ? "signup" : "signin");
                  setErrorMessage("");
                }}
                type="button"
              >
                {authMode === "signin" ? "Sign up for free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          {/* Background Image */}
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center object-cover"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpO8bfhCfQww6xc54ZweC0kQ-1BXNEizGw9dm4jc78HGiu7TPAWAibf2Bo4oFVGK6yRZtZ0cmzaNUBG8VgnhJr5g5Eu6uWvxBC3hO8iDlVYPhp22v3wCke97hdon5PnI_g-yRZEOCVYAE15sfvlCD6whmfRHnagGA5d_psHijVn_3qBpGC0c0H0RR23asKwqtbYksb16swa53D_zD9u6ZStubjcwF12lPSpAuCu_G7eKww_JdbxqWlJb-Cu3eDww9h17Vzqo-AoI8")`,
            }}
          ></div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Quote/Content on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-20 text-white">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black leading-tight mb-4">
                Connecting Culinary Talent with Opportunity
              </h2>
              <p className="text-xl font-medium leading-relaxed text-gray-200">
                The fastest way to hire top chefs or land your dream kitchen
                job. Join thousands of restaurants and culinary professionals
                building their future together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginTemplate;
