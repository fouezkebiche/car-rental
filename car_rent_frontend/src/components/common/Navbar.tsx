import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, User, Settings, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'customer';
  const isLoggedIn = !!localStorage.getItem('token');

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cars', label: 'Cars' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userProfile');
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Car Service Sharing</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              {isLoggedIn && userRole === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive('/admin')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              {isLoggedIn && userRole === 'owner' && (
                <Link
                  to="/owner"
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive('/owner')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Owner</span>
                </Link>
              )}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive('/login')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-2 mt-2">
                {isLoggedIn && userRole === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/admin')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    } rounded-md`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                {isLoggedIn && userRole === 'owner' && (
                  <Link
                    to="/owner"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/owner')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    } rounded-md`}
                  >
                    <User className="h-4 w-4" />
                    <span>Owner</span>
                  </Link>
                )}
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/login')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    } rounded-md`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;