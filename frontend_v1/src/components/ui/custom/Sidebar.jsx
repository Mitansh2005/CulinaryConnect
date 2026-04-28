import { Link, useLocation } from "react-router-dom";
import { MoonStar, SunMedium } from "lucide-react";
import { useCompanyInfo } from "@/api/home-data";
import { getUid } from "@/firebase/authUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, BrandMark } from "./enterprise-shell";
import { recruiterNavigation, isNavItemActive } from "./navigation-config";
import { motion } from "framer-motion";

const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Sidebar() {
  const location = useLocation();
  const uid = getUid();
  const { company } = useCompanyInfo(uid);
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="z-20 w-full self-start border-b border-white/60 bg-white/55 backdrop-blur-2xl dark:border-white/10 dark:bg-black/10 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-[300px] lg:shrink-0 lg:border-b-0 lg:border-r lg:overflow-y-auto">
      <motion.div
        className="flex h-full flex-col px-4 py-5 sm:px-6 lg:px-6 lg:py-8"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-3">
          <BrandMark subtitle="Recruiter studio" />
          <Button onClick={toggleTheme} size="icon" type="button" variant="outline" className="shrink-0">
            {theme === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 rounded-[1.75rem] border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
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
        </motion.div>

        <nav className="scrollbar-subtle mt-6 grid gap-2 overflow-x-auto pb-2 lg:mt-8">
          {recruiterNavigation.map(({ label, path, icon: Icon }) => {
            const active = isNavItemActive(location.pathname, path);
            return (
              <motion.div variants={itemVariants} key={path} className="relative w-full">
                <Link
                  className={`relative inline-flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "text-primary-foreground"
                      : "text-text-sub-light hover:-translate-y-0.5 hover:bg-white/75 hover:text-text-main-light hover:shadow-sm dark:text-text-sub-dark dark:hover:bg-white/10 dark:hover:text-text-main-dark"
                  }`}
                  to={path}
                >
                  {/* Sliding background */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute inset-0 rounded-2xl bg-primary shadow-float"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6 executive-panel p-4 lg:mt-auto"
        >
          <p className="section-kicker">Hiring principle</p>
          <p className="mt-3 font-display text-xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark">
            Verified track records beat guesswork.
          </p>
          <p className="mt-2 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
            Keep jobs current, review candidates quickly, and push every open role toward a trusted hire.
          </p>
        </motion.div>
      </motion.div>
    </aside>
  );
}
