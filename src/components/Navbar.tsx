import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaUpload, FaMoon, FaSun } from "react-icons/fa";
import logo from "../assets/logo.svg";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/store":
        return "Store Management";
      case "/sku":
        return "SKU Management";
      case "/planning":
        return "Planning Dashboard";
      case "/charts":
        return "Analytics Charts";
      default:
        return "Store Management";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (!document.getElementById("profile-menu")?.contains(e.target as Node)) {
        setShowMenu(false);
      }
    });
  }, []);

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative">
      <div className="flex items-center">
        <img src={logo} alt="GSynergy" className="h-14" />
      </div>
      <div className="relative" id="profile-menu">
        {/* Profile Icon */}
        <FaUserCircle
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            {/* <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {darkMode ? <FaSun /> : <FaMoon />} Toggle Theme
            </button>
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaUpload /> Upload Data
            </button>
            <hr className="border-gray-300" /> */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;