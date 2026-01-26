import { Navbar } from "@/components/ui/custom/Navbar";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-white bg-brandBackground text-center px-4">
          <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="mb-6">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </>
  );
}
