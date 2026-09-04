import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, MoonStar, SunMedium, LogOut } from "lucide-react";
import { getUid } from "@/firebase/authUtils";
import { doSignOut } from "@/firebase/auth";
import { useProfile } from "@/api/home-data";
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, BrandMark } from "./enterprise-shell";
import { chefNavigation, isNavItemActive } from "./navigation-config";

export function ChefNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = getUid();
  const { profile: userProfile } = useProfile(uid);
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const navItems = useMemo(() => chefNavigation, []);

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-white/60 bg-white/65 backdrop-blur-2xl dark:border-white/10 dark:bg-black/15">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <button
          className="flex items-center gap-3"
          onClick={() => navigate("/home")}
          type="button"
        >
          <BrandMark subtitle="For chefs" />
        </button>
        <nav className="relative hidden items-center gap-2 rounded-full border border-white/60 bg-white/60 p-1.5 shadow-sm backdrop-blur md:flex dark:border-white/10 dark:bg-white/5">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isNavItemActive(location.pathname, path);

            return (
              <Link
                key={path}
                to={path}
                className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              >
                {/* 🔥 Sliding background */}
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Content */}
                <span
                  className={`relative z-10 flex items-center gap-2 ${
                    active
                      ? "text-primary-foreground"
                      : "text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="hidden sm:inline-flex"
            onClick={toggleTheme}
            size="icon"
            type="button"
            variant="outline"
          >
            {theme === "light" ? (
              <MoonStar className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
          </Button>
          <Button aria-label="Notifications" size="icon" type="button" variant="outline">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="relative" ref={profileMenuRef}>
            <Button
              className="h-auto gap-3 p-1 pr-3.5 rounded-[24px] hover:rounded-[12px]"
              onClick={() => setProfileOpen((open) => !open)}
              type="button"
              variant="outline"
            >
              <Avatar
                className="h-10 w-10 rounded-full"
                name={`${userProfile?.first_name || ""} ${userProfile?.last_name || ""}`}
                src={userProfile?.profile_picture}
              />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                  {userProfile?.first_name || "Chef"}
                </p>
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                  {userProfile?.job_search_status || "Job seeker"}
                </p>
              </div>
            </Button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-[1.5rem] border border-white/70 bg-white/90 p-3 shadow-atelier backdrop-blur-xl dark:border-white/10 dark:bg-[#13211b]">
                <div className="rounded-[1.25rem] border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="font-semibold text-text-main-light dark:text-text-main-dark">
                    {userProfile?.first_name || "Chef"}{" "}
                    {userProfile?.last_name || ""}
                  </p>
                  <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                    {userProfile?.username || "culinary-professional"}
                  </p>
                </div>
                <div className="mt-3 grid gap-2">
                  <Link
                    className="rounded-[16px] px-4 py-3 text-sm font-semibold text-text-main-light transition-[border-radius,background-color,color] duration-300 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] hover:rounded-[10px] hover:bg-primary/10 hover:text-primary dark:text-text-main-dark"
                    onClick={() => setProfileOpen(false)}
                    to="/profile"
                  >
                    Open profile hub
                  </Link>
                  <button
                    className="group inline-flex items-center gap-2 rounded-[16px] px-4 py-3 text-left text-sm font-semibold text-rose-700 transition-[border-radius,background-color,color,transform] duration-300 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] hover:rounded-[10px] hover:bg-rose-50 active:scale-[0.98] dark:text-rose-300 dark:hover:bg-rose-500/10"
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/60 px-4 py-3 md:hidden dark:border-white/10">
        <nav className="scrollbar-subtle flex gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,black_88%,transparent)]">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isNavItemActive(location.pathname, path);
            return (
              <Link
                key={path}
                to={path}
                className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 ${
                    active
                      ? "text-primary-foreground"
                      : "text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
