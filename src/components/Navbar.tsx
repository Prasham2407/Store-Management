import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';


const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/store':
        return 'Store Management';
      case '/sku':
        return 'SKU Management';
      case '/planning':
        return 'Planning Dashboard';
      case '/charts':
        return 'Analytics Charts';
      default:
        return 'Store Management';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <img 
          src="../assets/gsynergy-logo.svg" 
          alt="GSynergy" 
          className="h-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <FaUserCircle className="w-6 h-6 text-gray-600" />
      </div>
    </div>
  );
};

export default Navbar; 