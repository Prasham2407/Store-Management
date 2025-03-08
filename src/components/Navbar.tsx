import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
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
        return 'Dashboard';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md h-16 flex-shrink-0">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold text-gray-800">Company Name</span>
        </div>

        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-700">{getPageTitle()}</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 