// import { useState } from 'react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaStore, FaBarcode, FaChartBar, FaCalendarAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white h-full shadow-sm">
      <nav className="mt-4">
        <NavLink
          to="/store"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <FaStore className="w-5 h-5 mr-3" />
          <span>Store</span>
        </NavLink>
        <NavLink
          to="/sku"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <FaBarcode className="w-5 h-5 mr-3" />
          <span>SKU</span>
        </NavLink>
        <NavLink
          to="/planning"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <FaCalendarAlt className="w-5 h-5 mr-3" />
          <span>Planning</span>
        </NavLink>
        <NavLink
          to="/charts"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
            }`
          }
        >
          <FaChartBar className="w-5 h-5 mr-3" />
          <span>Charts</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar; 