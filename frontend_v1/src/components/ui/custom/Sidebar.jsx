import { Link, useLocation } from "react-router-dom";
import { getUid } from "@/firebase/authUtils";
import { useCompanyInfo } from "@/api/home-data";
import { COMPANY_NAME } from "@/constants/constants";

export function Sidebar() {
    const location = useLocation();
    const uid = getUid();
    const { company } = useCompanyInfo(uid);
    const userType = localStorage.getItem("userType");

    const isActive = (path) => {
        // Handle exact matches or sub-routes
        if (path === "/home" && location.pathname === "/home") return true;
        if (path !== "/home" && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItemClass = (path) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive(path)
            ? "bg-primary/10 text-slate-900 dark:text-white font-semibold"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        }`;

    const iconClass = (path) =>
        `material-symbols-outlined text-[24px] transition-transform ${isActive(path)
            ? "text-green-700 dark:text-green-400"
            : "group-hover:scale-110"
        }`;

    return (
        <aside className="w-64 h-full bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-colors duration-300">
            <div className="p-6 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[20px] font-bold">restaurant_menu</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{COMPANY_NAME}</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium pl-10">Restaurant Admin</p>
            </div>

            <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
                {/* Dashboard */}
                <Link to="/home" className={navItemClass("/home")}>
                    <span className={iconClass("/home")}>dashboard</span>
                    <span className="text-sm">Dashboard</span>
                </Link>

                {/* Jobs Group */}
                <div className="mt-2 mb-1 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Recruitment
                </div>

                {/* Manage Jobs */}
                <Link to="/jobs/manage" className={navItemClass("/jobs/manage")}>
                    <span className={iconClass("/jobs/manage")}>work</span>
                    <span className="text-sm">Jobs</span>
                </Link>

                {/* Post New Job */}
                <Link to="/post-job" className={navItemClass("/post-job")}>
                    <span className={iconClass("/post-job")}>add_circle</span>
                    <span className="text-sm">Post Job</span>
                </Link>

                {/* Candidates (Applications) */}
                <Link to="/applications" className={navItemClass("/applications")}>
                    <span className={iconClass("/applications")}>group</span>
                    <span className="text-sm">Candidates</span>
                </Link>

                {/* Communication Group */}
                <div className="mt-4 mb-1 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Connect
                </div>

                {/* Messages */}
                <Link to="/messages" className={navItemClass("/messages")}>
                    <span className={iconClass("/messages")}>mail</span>
                    <span className="text-sm">Messages</span>
                    {/* Optional badge placeholder */}
                    {/* <span className="ml-auto bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span> */}
                </Link>

                {/* Settings Group */}
                <div className="mt-4 mb-1 px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Settings
                </div>

                {/* Company Profile */}
                <Link to="/company-profile" className={navItemClass("/company-profile")}>
                    <span className={iconClass("/company-profile")}>business</span>
                    <span className="text-sm">Company Profile</span>
                </Link>

                {/* User Profile / Settings */}
                <Link to="/profile" className={navItemClass("/profile")}>
                    <span className={iconClass("/profile")}>settings</span>
                    <span className="text-sm">Settings</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div
                        className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden bg-cover bg-center"
                        style={{
                            backgroundImage: company?.logo ? `url('data:image/png;base64,${company.logo}')` : 'none'
                        }}
                    >
                        {!company?.logo && (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-[16px]">business</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                            {company?.name || "Restaurant"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
