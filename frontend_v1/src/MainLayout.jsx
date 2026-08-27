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
      <div className="shell-canvas">
        <div className="relative z-10 flex min-h-screen flex-col lg:pl-[300px]">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0" ref={routeScopeRef}>
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-canvas">
      <ChefNavbar />
      <main 
        className={`relative z-10 ${
          location.pathname.startsWith("/messages")
            ? "flex flex-col h-[calc(100vh-5rem)]"
            : "min-h-[calc(100vh-5rem)]"
        }`} 
        ref={routeScopeRef}
      >
        <Outlet />
      </main>
    </div>
  );
}
