import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Gift, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState('/login');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const customerToken = localStorage.getItem('customerToken');
    const instanceId = localStorage.getItem('instanceId');

    if (adminToken) {
      setIsLoggedIn(true);
      setDashboardPath('/admin');
    } else if (customerToken && instanceId) {
      setIsLoggedIn(true);
      setDashboardPath(`/customizer/${instanceId}`);
    } else {
      setIsLoggedIn(false);
      setDashboardPath('/login');
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
    localStorage.removeItem('instanceId');
    setIsLoggedIn(false);
    setDashboardPath('/login');
    navigate('/');
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
    { name: 'On demand services', path: '/#on-demand' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-rosePrimary/5' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1" onClick={handleLinkClick}>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-wineDeep">
              AnKa
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rosePrimary animate-pulse-glow"></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = checkActive(link.path);
              return (
                <Link
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
                </Link>
              );
            })}
            
            {/* Desktop Auth Toggle */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={dashboardPath}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-rosePrimary/20 text-wineDeep bg-blushAccent/10 hover:bg-blushAccent/25 shadow-sm transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-rosePrimary/10 hover:bg-rosePrimary text-rosePrimary hover:text-white rounded-full transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider border border-rosePrimary/20 text-wineDeep bg-blushAccent/10 hover:bg-blushAccent/25 hover:border-rosePrimary/45 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
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
        <div className="md:hidden glass-card border-b border-rosePrimary/10 bg-white/95 animate-fade-in-up">
          <div className="px-3 pt-3 pb-5 space-y-2 sm:px-4">
            {navLinks.map((link) => {
              const isActive = checkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive 
                      ? 'bg-rosePrimary/10 text-rosePrimary' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Mobile Auth Toggle */}
            {isLoggedIn ? (
              <div className="space-y-2 pt-2 border-t border-rosePrimary/5">
                <Link
                  to={dashboardPath}
                  onClick={handleLinkClick}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 border border-rosePrimary/20 rounded-xl text-sm font-bold uppercase tracking-wider text-wineDeep bg-blushAccent/10 hover:bg-blushAccent/20"
                >
                  <User className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-rosePrimary hover:bg-wineDeep text-white rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 border border-rosePrimary/20 rounded-xl text-sm font-bold uppercase tracking-wider text-wineDeep bg-blushAccent/10 hover:bg-blushAccent/20"
              >
                <User className="w-4 h-4" />
                <span>Login / Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
