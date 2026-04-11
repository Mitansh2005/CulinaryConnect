/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, ShieldCheck, Users } from "lucide-react";
import { MdErrorOutline } from "react-icons/md";
import axios from "axios";
import GoogleIcon from "../../assets/icons/google.png";
import {
  doCreateUserWithEmailPassword,
  doSignInWithEmailPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { auth } from "@/firebase/firebase";
import { baseUrl } from "@/constants/constants";
import { useAuth } from "../../contexts/authContext";
import { getFreshIdToken, getUid, setUpProfile } from "@/firebase/authUtils";
import { BrandMark } from "@/components/ui/custom/enterprise-shell";

const showcasePoints = [
  {
    icon: BadgeCheck,
    title: "Verified marketplace rhythm",
    description: "Recruiter onboarding captures business details early so hiring conversations start with more trust.",
  },
  {
    icon: Users,
    title: "Chefs and restaurants in one flow",
    description: "Switch between chef and restaurant access without jumping into a separate product experience.",
  },
  {
    icon: Clock3,
    title: "Faster shortlist decisions",
    description: "Cleaner profiles and clearer role matching reduce back-and-forth before interviews are scheduled.",
  },
];

const roleCopy = {
  restaurant: {
    title: "Restaurant",
    description: "Post roles, verify your business, and track applicants from one calmer dashboard.",
  },
  chef: {
    title: "Chef",
    description: "Build your profile, show your experience, and move through openings with less friction.",
  },
};

function AuthInput({
  label,
  id,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
  action,
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-sub-light dark:text-text-sub-dark">
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </span>
        <input
          className="block w-full rounded-[1.2rem] border border-stone-200 bg-stone-50/95 py-3 pl-12 pr-12 text-sm text-text-main-light shadow-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/6 dark:text-text-main-dark"
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
        {action ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">{action}</div>
        ) : null}
      </div>
    </div>
  );
}

function LoginTemplate({ initialMode = "signin" }) {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [userType, setUserType] = useState(initialMode === "signup" ? "chef" : "restaurant");
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
  const [authMode, setAuthMode] = useState(initialMode);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegisterIn, setIsRegisterIn] = useState(false);
  const [formValid, setFormValid] = useState(initialMode === "signup");
  const [profileSetUpComplete, setProfileSetUpComplete] = useState(false);

  useEffect(() => {
    setAuthMode(initialMode);
    setErrorMessage("");
  }, [initialMode]);

  useEffect(() => {
    if (userLoggedIn) {
      if (authMode === "signup" && !profileSetUpComplete) {
        return;
      }
      navigate("/home");
    }
  }, [userLoggedIn, profileSetUpComplete, authMode, navigate]);

  useEffect(() => {
    const valid =
      userType !== "restaurant" ||
      (companyName.trim() !== "" && fssaiLicense.trim() !== "");
    setFormValid(valid);
  }, [userType, companyName, fssaiLicense]);

  const checkFunction = () => {
    if (password === confirmpassword) {
      return true;
    }

    setErrorMessage("Both password fields should match.");
    return false;
  };

  const checkUserType = async (selectedType) => {
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

      return res.data.user_type === selectedType;
    } catch (error) {
      console.error("Error checking user type:", error);
      return false;
    }
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
              uid,
              username: "New User",
              user_type: userType,
              company_name: companyName || null,
              fssai_license_no: fssaiLicense || null,
            });
            localStorage.setItem("userData", JSON.stringify(res.data));
            localStorage.setItem("userType", userType);
          } catch {
            setProfileSetUpComplete(false);
            setErrorMessage("Something went wrong while creating your profile.");
            const user = auth.currentUser;
            if (user) {
              await user.delete();
            }
            return;
          }

          setProfileSetUpComplete(true);
        } catch (err) {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.delete();
          }
          console.error(err);
          setErrorMessage("Please try again with a valid email and password.");
        } finally {
          setIsRegisterIn(false);
          setSubmitLoading(false);
        }
      }
      return;
    }

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        setSubmitLoading(true);
        await doSignInWithEmailPassword(email, password);

        const typeMatch = await checkUserType(userType);
        if (!typeMatch) {
          await auth.signOut();
          setErrorMessage("User type does not match this account. Please try again.");
          return;
        }

        localStorage.setItem("userType", userType);
        setProfileSetUpComplete(true);
      } catch {
        setErrorMessage("Try again with the correct email and password.");
      } finally {
        setIsSigningIn(false);
        setSubmitLoading(false);
      }
    }
  };

  const onGoogleAuth = async (mode) => {
    if (mode === "signup") {
      if (!isRegisterIn || !formValid) {
        if (!formValid && userType === "restaurant") {
          setErrorMessage("Add company name and FSSAI license number to continue.");
        }
      }
      if (!isRegisterIn && formValid) {
        setIsRegisterIn(true);
        try {
          setGoogleLoading(true);
          await doSignInWithGoogle();
          const uid = getUid();

          try {
            const res = await setUpProfile({
              uid,
              username: "New User",
              user_type: userType,
              company_name: companyName || null,
              fssai_license_no: fssaiLicense || null,
            });
            localStorage.setItem("userData", JSON.stringify(res.data));
            localStorage.setItem("userType", userType);
          } catch (err) {
            setProfileSetUpComplete(false);
            setErrorMessage(`Something went wrong: ${err.message}`);
            const user = auth.currentUser;
            if (user) {
              await user.delete();
            }
            return;
          }

          setProfileSetUpComplete(true);
        } catch (err) {
          setErrorMessage(`Something went wrong: ${err.message}`);
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.delete();
          }
        } finally {
          setIsRegisterIn(false);
          setGoogleLoading(false);
        }
      }
      return;
    }

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        setGoogleLoading(true);
        await doSignInWithGoogle();

        const typeMatch = await checkUserType(userType);
        if (!typeMatch) {
          await auth.signOut();
          setErrorMessage("User type does not match this account. Please try again.");
          return;
        }

        localStorage.setItem("userType", userType);
        setProfileSetUpComplete(true);
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setIsSigningIn(false);
        setGoogleLoading(false);
      }
    }
  };

  const roleDetail = roleCopy[userType];

  return (
    <div className="shell-canvas">
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex w-full items-center justify-center px-4 py-5 sm:px-6 lg:min-h-screen lg:w-[48%] lg:px-8 lg:py-4">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="glass-panel w-full max-w-[42rem] overflow-hidden"
          >
            <div className="border-b border-white/60 bg-white/60 px-5 py-4 dark:border-white/10 dark:bg-white/6 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <BrandMark compact subtitle="Culinary hiring atelier" />
                <div className="rounded-full border border-ember-200 bg-ember-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-ember-700 dark:border-ember-500/20 dark:bg-ember-500/12 dark:text-ember-200">
                  {authMode === "signin" ? "Welcome back" : "Join the network"}
                </div>
              </div>
            </div>

            <div className="grid gap-5 px-5 py-5 sm:px-7 sm:py-6">
              <div className="space-y-2">
                <p className="section-kicker">{authMode === "signin" ? "Access portal" : "Create your workspace"}</p>
                <h1 className="font-display text-[2rem] font-semibold tracking-[-0.05em] text-text-main-light dark:text-text-main-dark sm:text-[2.35rem]">
                  {authMode === "signin" ? "Enter the culinary hiring floor." : "Create an account that fits your role."}
                </h1>
                <p className="max-w-xl text-sm leading-6 text-text-sub-light dark:text-text-sub-dark">
                  Switch your role first, then continue with email or Google. Restaurant sign-up
                  captures verification details immediately so the platform stays usable and credible.
                </p>
              </div>

              {errorMessage ? (
                <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50/95 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
                  <div className="flex items-start gap-3">
                    <MdErrorOutline className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-300" />
                    <p className="text-sm font-medium text-rose-800 dark:text-rose-100">{errorMessage}</p>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 rounded-[1.45rem] border border-stone-200 bg-stone-50/70 p-3 dark:border-white/10 dark:bg-white/5 sm:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="section-kicker">Choose your role</p>
                  <div className="mt-2 flex h-11 w-full items-center rounded-[1rem] bg-stone-100 p-1 dark:bg-white/5">
                    {["restaurant", "chef"].map((role) => {
                      const active = userType === role;
                      return (
                        <label
                          key={role}
                          className={`flex h-full grow cursor-pointer items-center justify-center rounded-[0.85rem] px-2 text-sm font-semibold transition ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
                          }`}
                        >
                          <input
                            checked={active}
                            className="sr-only"
                            name="role-selection"
                            onChange={() => setUserType(role)}
                            type="radio"
                            value={role}
                          />
                          {roleDetail && role === userType ? roleDetail.title : role === "restaurant" ? "Restaurant" : "Chef"}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-[1.1rem] border border-white/80 bg-white/95 p-3.5 dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                    {roleDetail.title} access
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-sub-light dark:text-text-sub-dark">
                    {roleDetail.description}
                  </p>
                </div>
              </div>

              <motion.form
                layout
                className="space-y-4"
                onSubmit={(e) => onSubmit(e, authMode)}
              >
                <AuthInput
                  id="email"
                  icon="mail"
                  label="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={userType === "restaurant" ? "name@restaurant.com" : "chef@kitchen.com"}
                  type="email"
                  value={email}
                />

                <div className={authMode === "signup" ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>
                  <AuthInput
                    id="password"
                    icon="lock"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    action={
                      <button
                        className="text-text-sub-light transition hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
                        onClick={() => setPasswordVisible((current) => !current)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {passwordVisible ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    }
                  />

                  {authMode === "signup" ? (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      initial={{ opacity: 0, x: -16 }}
                    >
                      <AuthInput
                        id="confirmPassword"
                        icon="lock"
                        label="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={confirmpassword}
                        action={
                          <button
                            className="text-text-sub-light transition hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
                            onClick={() => setConfirmPasswordVisible((current) => !current)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {confirmPasswordVisible ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        }
                      />
                    </motion.div>
                  ) : null}
                </div>

                <AnimatePresence mode="wait">
                  {userType === "restaurant" && authMode === "signup" ? (
                    <motion.div
                      key="restaurant-fields"
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="grid gap-4 rounded-[1.45rem] border border-stone-200 bg-stone-50/70 p-3 dark:border-white/10 dark:bg-white/5 md:grid-cols-2"
                    >
                      <AuthInput
                        id="companyName"
                        icon="storefront"
                        label="Company name"
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your restaurant or hospitality group"
                        value={companyName}
                      />
                      <AuthInput
                        id="fssaiLicense"
                        icon="verified"
                        label="FSSAI license number"
                        onChange={(e) => setFssaiLicense(e.target.value)}
                        placeholder="Registration / license number"
                        value={fssaiLicense}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-[1.2rem] bg-gradient-to-r from-primary via-ember-500 to-ember-600 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-float transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitLoading || googleLoading}
                  type="submit"
                >
                  <span>{submitLoading ? "Working..." : authMode === "signin" ? "Sign in to dashboard" : "Create account"}</span>
                  {!submitLoading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </motion.form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-light/80 dark:border-border-dark/70" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background-light px-4 text-xs font-semibold uppercase tracking-[0.22em] text-text-sub-light dark:bg-background-dark dark:text-text-sub-dark">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                className="flex w-full items-center justify-center gap-3 rounded-[1.2rem] border border-stone-200 bg-white/95 px-4 py-3 text-sm font-semibold text-text-main-light shadow-sm transition hover:border-primary/25 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-text-main-dark dark:hover:bg-white/10"
                disabled={googleLoading || submitLoading}
                onClick={() => onGoogleAuth(authMode)}
                type="button"
              >
                {googleLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
                ) : (
                  <>
                    <img alt="Google" className="h-5 w-5" src={GoogleIcon} />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <p className="text-center text-sm text-text-sub-light dark:text-text-sub-dark">
                {authMode === "signin" ? "Need an account?" : "Already registered?"}
                <Link
                  className="ml-1 font-semibold text-text-main-light transition hover:text-primary dark:text-text-main-dark dark:hover:text-primary"
                  to={authMode === "signin" ? "/register" : "/login"}
                >
                  {authMode === "signin" ? "Create one now" : "Sign in instead"}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:flex lg:min-h-screen lg:w-[52%] lg:items-center lg:justify-center lg:px-6 lg:py-4">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="relative w-full max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,251,246,0.94),rgba(246,235,221,0.92))] p-6 shadow-atelier backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(40,33,28,0.92),rgba(24,20,18,0.9))]"
          >
            <div className="absolute -left-12 top-10 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative grid gap-5">
              <div className="rounded-[1.6rem] border border-white/80 bg-white/82 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-kicker">Platform snapshot</p>
                    <h2 className="mt-2 max-w-xl font-display text-[2rem] font-semibold tracking-[-0.05em] text-text-main-light dark:text-text-main-dark">
                      The interface is calmer, but the hiring pace stays fast.
                    </h2>
                  </div>
                  <div className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/10 dark:text-forest-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified flow
                    </div>
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-sub-light dark:text-text-sub-dark">
                  CulinaryConnect is being reshaped around deliberate spacing, credible onboarding,
                  and role-specific workflows so the product feels like a hiring studio instead of a
                  generic listings page.
                </p>
              </div>

              <div className="grid gap-3">
                {showcasePoints.slice(0, 2).map(({ icon: Icon, title, description }, index) => (
                  <motion.article
                    key={title}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: 18 }}
                    transition={{ delay: 0.16 + index * 0.08, duration: 0.45 }}
                    className="rounded-[1.45rem] border border-white/80 bg-white/84 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/12 text-secondary dark:bg-secondary/16">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
                          {description}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginTemplate;
