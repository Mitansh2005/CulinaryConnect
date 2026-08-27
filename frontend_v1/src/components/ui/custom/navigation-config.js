import {
  BriefcaseBusiness,
  Building2,
  Compass,
  FileText,
  Heart,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  UserRound,
  Users,
} from "lucide-react";

export const chefNavigation = [
  { label: "Discover", path: "/home", icon: Compass },
  { label: "Applications", path: "/applications", icon: FileText },
  { label: "Saved Jobs", path: "/liked-jobs", icon: Heart },
  { label: "Messages", path: "/messages", icon: MessageSquare },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export const recruiterNavigation = [
  { label: "Dashboard", path: "/home", icon: LayoutDashboard },
  { label: "Explorer", path: "/talent-explorer", icon: Compass },
  { label: "Jobs", path: "/jobs/manage", icon: BriefcaseBusiness },
  { label: "Post Role", path: "/post-job", icon: PlusCircle },
  { label: "Candidates", path: "/applications", icon: Users },
  { label: "Messages", path: "/messages", icon: MessageSquare },
  { label: "Company", path: "/company-profile", icon: Building2 },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export function isNavItemActive(currentPath, itemPath) {
  if (itemPath === "/home") {
    return currentPath === "/home";
  }
  return currentPath.startsWith(itemPath);
}
