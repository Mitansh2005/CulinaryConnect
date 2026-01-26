import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUid } from "@/firebase/authUtils";
import { useProfile } from "@/api/home-data";
import { useState } from "react";
import { useAuth } from "@/contexts/authContext";

export function ChefNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const uid = getUid();
    const { profile: userProfile, loading } = useProfile(uid);
    const [profileOpen, setProfileOpen] = useState(false);
    const { logout } = useAuth(); // Assuming useAuth has logout function

    const isActive = (path) => {
        if (location.pathname === path) return true;
        // Basic match: if we are on /job/123, maybe highlight "Job Feed" (home)?
        // For now exact match + sub-routes if needed.
        return false;
    };

    // Helper for tab class
    const tabClass = (path) =>
        `border-b-2 py-4 text-sm font-medium transition-colors ${isActive(path)
            ? "border-primary font-bold text-text-main-light dark:text-white"
            : "border-transparent text-text-sub-light hover:border-gray-300 hover:text-text-main-light dark:text-text-sub-dark dark:hover:border-gray-600 dark:hover:text-text-main-dark"
        }`;

    const handleLogout = async () => {
        try {
            // If your logout is a promise
            await logout(); // Or firebase signOut
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-[#182c20]/80 px-4 py-3 sm:px-6 lg:px-8 font-display">
            <div className="mx-auto flex max-w-7xl items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[#102216]">
                        <span className="material-symbols-outlined">skillet</span>
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-text-main-light dark:text-white hidden sm:block">
                        Culinary Connect
                    </h1>
                </div>

                {/* Navigation Tabs (Centered/Mixed) - Hidden on mobile? Or integrated? 
                    The design shows tabs below. Let's put main nav links here for desktop 
                    or keep tabs separately in page. But "navbar" usually implies top links.
                    The HTML had them as "Tabs Navigation" below header. 
                    I'll put them IN the header for better UX as a navbar replacement.
                */}
                <nav className="hidden md:flex gap-8">
                    <Link to="/home" className={`${isActive("/home") ? "text-primary font-bold" : "text-text-sub-light dark:text-gray-400 hover:text-text-main-light dark:hover:text-white"} text-sm font-medium transition-colors`}>
                        Job Feed
                    </Link>
                    <Link to="/applications" className={`${isActive("/applications") ? "text-primary font-bold" : "text-text-sub-light dark:text-gray-400 hover:text-text-main-light dark:hover:text-white"} text-sm font-medium transition-colors`}>
                        My Applications
                    </Link>
                    <Link to="/liked-jobs" className={`${isActive("/liked-jobs") ? "text-primary font-bold" : "text-text-sub-light dark:text-gray-400 hover:text-text-main-light dark:hover:text-white"} text-sm font-medium transition-colors`}>
                        Saved
                    </Link>
                    <Link to="/messages" className={`${isActive("/messages") ? "text-primary font-bold" : "text-text-sub-light dark:text-gray-400 hover:text-text-main-light dark:hover:text-white"} text-sm font-medium transition-colors`}>
                        Messages
                    </Link>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-sub-light transition hover:bg-gray-100 hover:text-text-main-light dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
                        <span className="material-symbols-outlined">notifications</span>
                        {/* <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#182c20]"></span> */}
                    </button>

                    <div className="relative">
                        {(() => {
                            const pfp = userProfile?.profile_picture;
                            const isUrl = pfp?.startsWith("http");
                            const bgImage = pfp
                                ? (isUrl ? `url('${pfp}')` : `url('data:image/png;base64,${pfp}')`)
                                : 'none';

                            return (
                                <div
                                    className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-cover bg-center dark:border-gray-700"
                                    style={{ backgroundImage: bgImage }}
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    {!pfp && (
                                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-500">person</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Dropdown Menu */}
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#182c20] dark:ring-gray-700 z-50">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {userProfile?.first_name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {userProfile?.username || "Chef"}
                                    </p>
                                </div>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-800"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Nav (visible only on small screens) */}
            <div className="md:hidden mt-3 border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-around">
                <Link to="/home" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">home</span>
                    Feed
                </Link>
                <Link to="/applications" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">work</span>
                    Apps
                </Link>
                <Link to="/liked-jobs" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">favorite</span>
                    Saved
                </Link>
                <Link to="/messages" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">mail</span>
                    Msgs
                </Link>
            </div>
        </header>
    );
}
