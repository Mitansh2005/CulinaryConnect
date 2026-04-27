import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/ui/custom/Sidebar";
import { ChefNavbar } from "./components/ui/custom/ChefNavbar";
import { useUser } from "@/contexts/UserContext";
import { useRouteTransition } from "@/components/hooks/useCulinaryMotion";

export default function MainLayout() {
  const routeScopeRef = useRef(null);
  const location = useLocation();
  const { userData } = useUser();
  const isRestaurant = userData?.user_type === "restaurant";

  useRouteTransition({
    scopeRef: routeScopeRef,
    dependencies: [isRestaurant, location.pathname],
  });

  if (isRestaurant) {
    return (
      <div className="shell-canvas" ref={routeScopeRef}>
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
    <div className="shell-canvas" ref={routeScopeRef}>
      <ChefNavbar />
      <main className="relative z-10 min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </div>
  );
}
