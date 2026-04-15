import { COMPANY_NAME } from "@/constants/constants";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/icons/brand_icon.png";
import { FaHouse } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa6";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import React from "react";
import { useUser } from "@/contexts/UserContext";
export function Navbar() {
  const { userData } = useUser();
  const userType = userData?.user_type;
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) =>
    `flex flex-col items-center justify-center h-full px-6 relative ease-linear duration-100 transition-colors ${
      isActive(path)
        ? "bg-beige-600 border-b-4 border-beige-300 "
        : "text-gray-600 hover:bg-gray-100"
    }`;
  const navLinks = (
    <>
      {/* HOME */}
      <Link to="/home" className={navItemClass("/home")}>
        <FaHouse className="w-5 h-5" />
      </Link>

      <Link to="/applications" className={navItemClass("/applications")}>
        <FaBriefcase className="w-5 h-5" />
      </Link>
      {/* restaurant-only links */}
      {userType === "restaurant" && (
        <Link to="/post-job" className={navItemClass("/post-job")}>
          <FaBriefcaseMedical className="w-5 h-5" />
        </Link>
      )}

      {/* MESSAGES */}
      <Link to="/messages" className={navItemClass("/messages")}>
        <FaMessage className="w-5 h-5" />
      </Link>

      {/* PROFILE */}
      <Link to="/profile" className={navItemClass("/profile")}>
        <FaUser className="w-5 h-5" />
      </Link>

      {/* COMPANY PROFILE */}
      {userType === "restaurant" && (
        <Link
          to="/company-profile"
          className={navItemClass("/company-profile")}
        >
          <FaBuilding className="w-5 h-5" />
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white flex items-center justify-between flex-row h-20 min-w-full top-0 z-50 px-6 shadow-md">
      {/* left section */}
      <section className="h-full flex items-center">
        <Link to="/home">
          <div className="flex items-center ">
            <img src={Logo} alt="company-logo" className="w-14 mr-2" />
            <h1 className="text-3xl font-title font-medium">{COMPANY_NAME}</h1>
          </div>
        </Link>
      </section>
      <section className="hidden md:flex flex-row justify-between h-full items-center">
        {navLinks}
      </section>
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-20 left-0 z-50 w-full bg-white shadow-lg flex flex-col items-center md:hidden">
          {navLinks?.props?.children &&
            React.Children.map(navLinks.props.children, (child) =>
              React.cloneElement(child, {
                className:
                  "w-full py-3 flex justify-center border-b border-beige-500",
                onClick: () => setMenuOpen(false),
              }),
            )}
        </div>
      )}
    </nav>
  );
}
