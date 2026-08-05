import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Gift, User, LogOut } from 'lucide-react';
import SmartLink from './SmartLink';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState('/dashboard');
  const [dashboardLabel, setDashboardLabel] = useState('Dashboard');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const customerToken = localStorage.getItem('customerToken');
    const customerEmail = localStorage.getItem('customerEmail');

    if (adminToken) {
      setIsLoggedIn(true);
      setDashboardPath('/admin');
      setDashboardLabel('Admin Panel');
    } else if (customerEmail || customerToken) {
      setIsLoggedIn(true);
      setDashboardPath('/dashboard');
      setDashboardLabel('Dashboard');
    } else {
      setIsLoggedIn(false);
      setDashboardPath('/dashboard');
      setDashboardLabel('Dashboard');
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const targetId = path.split('#')[1];
      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
      handleLinkClick();
    } else {
      handleLinkClick();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('instanceId');
    localStorage.removeItem('customerInstanceId');
    setIsLoggedIn(false);
    navigate('/login');
    window.location.reload();
    handleLinkClick();
  };

  const checkActive = (path) => {
    if (path.startsWith('/#')) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pyaar Ke Pal', path: '/surprises', icon: Gift },
    { name: 'On demand services', path: '/on-demand' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      (isScrolled || isOpen) 
        ? 'bg-white shadow-sm border-b border-rosePrimary/5' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <SmartLink to="/" className="flex items-center space-x-1" onClick={handleLinkClick}>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-wineDeep">
              AnKa
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rosePrimary animate-pulse-glow"></span>
          </SmartLink>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = checkActive(link.path);
              return (
                <SmartLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`text-base font-medium tracking-wide transition-colors relative py-2 ${
                    isActive 
                      ? 'text-rosePrimary font-bold' 
                      : 'text-slate-655 hover:text-rosePrimary'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-rosePrimary" />
                  )}
                </SmartLink>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <SmartLink
                  to={dashboardPath}
                  onClick={handleLinkClick}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rosePrimary to-wineDeep text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{dashboardLabel}</span>
                </SmartLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-rosePrimary/20 text-rosePrimary bg-rosePrimary/10 hover:bg-rosePrimary hover:text-white shadow-sm transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <SmartLink
                to="/login"
                onClick={() => {
                  if (window.location.pathname !== '/login' && window.location.pathname !== '/dashboard') {
                    sessionStorage.setItem('returnUrl', window.location.pathname);
                  }
                }}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider border border-rosePrimary/20 text-wineDeep bg-blushAccent/10 hover:bg-blushAccent/25 hover:border-rosePrimary/45 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </SmartLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-white border-b border-rosePrimary/10 shadow-lg animate-fade-in-down z-50">
          <div className="px-3 pt-3 pb-5 space-y-2 sm:px-4">
            {navLinks.map((link) => {
              const isActive = checkActive(link.path);
              return (
                <SmartLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-rosePrimary/10 text-rosePrimary font-bold'
                      : 'text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  {link.name}
                </SmartLink>
              );
            })}
            
            <div className="pt-2 border-t border-rosePrimary/10 space-y-2">
              {isLoggedIn ? (
                <>
                  <SmartLink
                    to={dashboardPath}
                    onClick={handleLinkClick}
                    className="block w-full py-3 text-center bg-gradient-to-r from-rosePrimary to-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm"
                  >
                    Go To {dashboardLabel}
                  </SmartLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-rose-50 text-rosePrimary font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <SmartLink
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full py-3 text-center bg-gradient-to-r from-rosePrimary to-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Sign In
                </SmartLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
