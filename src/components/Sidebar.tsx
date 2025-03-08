import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStore, FaBoxes, FaClipboardList, FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/store', label: 'Store', icon: FaStore },
    { path: '/sku', label: 'SKU', icon: FaBoxes },
    { path: '/planning', label: 'Planning', icon: FaClipboardList },
    { path: '/charts', label: 'Charts', icon: FaChartBar },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-6">        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon 
                  className={`mr-3 transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                  }`} 
                  size={20} 
                />
                <span className={`font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-8 bg-blue-600 absolute right-0 rounded-l-md"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 