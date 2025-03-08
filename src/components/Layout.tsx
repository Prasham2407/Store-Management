import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar - Full Width */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar - Fixed Width */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Page Content - Remaining Width */}
        <div className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
