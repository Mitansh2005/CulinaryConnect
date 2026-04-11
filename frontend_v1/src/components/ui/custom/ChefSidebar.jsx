import { Link, useLocation } from "react-router-dom";
import { MoonStar, SunMedium } from "lucide-react";
import { getUid } from "@/firebase/authUtils";
import { useProfile } from "@/api/home-data";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, BrandMark } from "./enterprise-shell";
import { chefNavigation, isNavItemActive } from "./navigation-config";

export function ChefSidebar() {
  const location = useLocation();
  const uid = getUid();
  const { profile: userProfile } = useProfile(uid);
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden min-h-screen w-[290px] shrink-0 border-r border-white/60 bg-white/55 px-6 py-8 backdrop-blur-2xl dark:border-white/10 dark:bg-black/10 lg:flex lg:flex-col">
      <div className="flex items-center justify-between gap-3">
        <BrandMark subtitle="Chef workspace" />
        <Button onClick={toggleTheme} size="icon" type="button" variant="outline">
          {theme === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="mt-8 grid gap-2">
        {chefNavigation.map(({ label, path, icon: Icon }) => {
          const active = isNavItemActive(location.pathname, path);
          return (
            <Link
              key={path}
              className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-float"
                  : "text-text-sub-light hover:bg-white/75 hover:text-text-main-light dark:text-text-sub-dark dark:hover:bg-white/8 dark:hover:text-text-main-dark"
              }`}
              to={path}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto executive-panel p-4">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-12 w-12 rounded-2xl"
            name={`${userProfile?.first_name || ""} ${userProfile?.last_name || ""}`}
            src={userProfile?.profile_picture}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-main-light dark:text-text-main-dark">
              {userProfile?.first_name || "Chef"}
            </p>
            <p className="truncate text-xs text-text-sub-light dark:text-text-sub-dark">
              {userProfile?.speciality || "Culinary professional"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
