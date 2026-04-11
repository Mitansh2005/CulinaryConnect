import { Link, useLocation } from "react-router-dom";
import { MoonStar, SunMedium } from "lucide-react";
import { useCompanyInfo } from "@/api/home-data";
import { getUid } from "@/firebase/authUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, BrandMark } from "./enterprise-shell";
import { recruiterNavigation, isNavItemActive } from "./navigation-config";

export function Sidebar() {
  const location = useLocation();
  const uid = getUid();
  const { company } = useCompanyInfo(uid);
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="z-20 w-full border-b border-white/60 bg-white/55 backdrop-blur-2xl dark:border-white/10 dark:bg-black/10 lg:min-h-screen lg:w-[300px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5 sm:px-6 lg:px-6 lg:py-8">
        <div className="flex items-center justify-between gap-3">
          <BrandMark subtitle="Recruiter studio" />
          <Button onClick={toggleTheme} size="icon" type="button" variant="outline">
            {theme === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
          </Button>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="section-kicker">Company</p>
          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-14 w-14 rounded-2xl" name={company?.name || "Restaurant"} src={company?.logo} />
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark">
                {company?.name || "Restaurant HQ"}
              </p>
              <p className="truncate text-sm text-text-sub-light dark:text-text-sub-dark">
                FSSAI verified hiring workspace
              </p>
            </div>
          </div>
        </div>

        <nav className="scrollbar-subtle mt-6 grid gap-2 overflow-x-auto pb-2 lg:mt-8">
          {recruiterNavigation.map(({ label, path, icon: Icon }) => {
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

        <div className="mt-6 executive-panel p-4 lg:mt-auto">
          <p className="section-kicker">Hiring principle</p>
          <p className="mt-3 font-display text-xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark">
            Verified track records beat guesswork.
          </p>
          <p className="mt-2 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
            Keep jobs current, review candidates quickly, and push every open role toward a trusted hire.
          </p>
        </div>
      </div>
    </aside>
  );
}
