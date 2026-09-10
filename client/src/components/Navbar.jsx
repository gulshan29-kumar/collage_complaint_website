import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wrench, Menu, X, LogOut, User as UserIcon, PlusCircle, LayoutDashboard, ListFilter } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">CampusFix</span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  Maintenance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden md:ml-8 md:flex md:space-x-2">
                {/* Student Links */}
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/"
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/')
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/create-complaint"
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/create-complaint')
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      Create Complaint
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin')
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Admin Dashboard
                    </Link>
                  </>
                )}

                {/* Staff Links */}
                {user.role === 'staff' && (
                  <>
                    <Link
                      to="/staff"
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/staff')
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Staff Dashboard
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Info & Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-sky-600">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:text-red-600 focus:outline-none transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-sky-600 px-3 py-2 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-sky-600 hover:bg-sky-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <div className="font-medium text-slate-800">{user.name}</div>
                <div className="text-xs text-sky-600 uppercase font-semibold">{user.role}</div>
              </div>

              {user.role === 'student' && (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-complaint"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                  >
                    Create Complaint
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  Admin Dashboard
                </Link>
              )}

              {user.role === 'staff' && (
                <Link
                  to="/staff"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  Staff Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-sky-600 hover:bg-sky-50 font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
