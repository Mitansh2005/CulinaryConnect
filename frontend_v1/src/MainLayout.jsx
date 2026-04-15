import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/ui/custom/Sidebar";
import { ChefNavbar } from "./components/ui/custom/ChefNavbar";
import { useUser } from "@/contexts/UserContext";

export default function MainLayout() {
  const { userData } = useUser();
  const isRestaurant = userData?.user_type === "restaurant";

  if (isRestaurant) {
    return (
      <div className="shell-canvas">
        <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <div className="min-h-screen overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-canvas">
      <ChefNavbar />
      <main className="relative z-10 min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </div>
  );
}
