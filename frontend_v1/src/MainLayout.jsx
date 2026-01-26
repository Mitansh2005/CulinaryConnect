import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/ui/custom/Sidebar";
import { ChefNavbar } from "./components/ui/custom/ChefNavbar";

export default function MainLayout() {
	const userType = localStorage.getItem("userType");

	if (userType === "restaurant") {
		return (
			<div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
				<Sidebar />
				<main className="flex-1 h-full overflow-y-auto w-full">
					{/* For recruiters, the Sidebar provides navigation */}
					<Outlet />
				</main>
			</div>
		);
	}

	return (
		<>
			<ChefNavbar />
			<Outlet />
		</>
	);
}
