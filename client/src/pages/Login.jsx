import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.service';
import { Key, User, ShieldAlert, Heart, Globe, AlertCircle, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'

  // Customer Account Auth state
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [customerEmail, setCustomerEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Admin credentials state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [conflictSessions, setConflictSessions] = useState([]);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = googleClientId && !googleClientId.includes('demo') && !googleClientId.includes('placeholder');

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin');
    } else if (localStorage.getItem('customerToken') || localStorage.getItem('customerEmail')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    if (window.google?.accounts?.id && activeTab === 'customer' && isGoogleConfigured) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          use_fedcm_for_prompt: true
        });

        const container = document.getElementById('googleSignInBtnContainerLogin');
        if (container) {
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      } catch (err) {
        console.warn('Google init warning:', err);
      }
    }
  }, [activeTab, authTab, googleClientId, isGoogleConfigured]);

  const handleGoogleCredentialResponse = async (response) => {
    if (response?.credential) {
      const decoded = parseGoogleJwt(response.credential);
      if (decoded && decoded.email) {
        try {
          const res = await api.customerGoogleAuth(decoded.email, decoded.name, response.credential);
          const activeToken = (res && res.success && res.token) ? res.token : response.credential;
          const userEmail = (res && res.user && res.user.email) ? res.user.email : decoded.email;
          localStorage.setItem('customerToken', activeToken);
          localStorage.setItem('customerEmail', userEmail);
          navigate('/dashboard');
        } catch (err) {
          localStorage.setItem('customerToken', response.credential);
          localStorage.setItem('customerEmail', decoded.email);
          navigate('/dashboard');
        }
      }
    }
  };

  const parseGoogleJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleCustomerLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.customerAccountLogin(loginEmail.trim(), loginPassword);
      if (res.success && res.token) {
        localStorage.setItem('customerToken', res.token);
        localStorage.setItem('customerEmail', res.user.email);
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error logging in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.customerAccountRegister(regName.trim(), regEmail.trim(), regPassword);
      if (res.success && res.token) {
        localStorage.setItem('customerToken', res.token);
        localStorage.setItem('customerEmail', res.user.email);
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Network error creating account.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e, forceLogoutDeviceId = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await api.loginAdmin(adminUsername, adminPassword, forceLogoutDeviceId);
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setShowConflictModal(false);
        navigate('/admin');
      } else if (data.sessions) {
        setConflictSessions(data.sessions);
        setShowConflictModal(true);
      } else {
        setErrorMsg(data.message || 'Invalid Admin credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = activeTab === 'customer';

  return (
    <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center px-4 transition-colors duration-500 ${
      isCustomer ? 'bg-[#FFF7F5]' : 'bg-slate-50'
    }`}>
      
      {/* Decorative Warm Ambient Glows */}
      {isCustomer ? (
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-rosePrimary/10 rounded-full blur-[140px] pointer-events-none" />
      ) : (
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-wineDeep/10 rounded-full blur-[140px] pointer-events-none" />
      )}

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Top Sliding Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-white/90 border border-rosePrimary/15 rounded-2xl shadow-sm text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('customer'); setErrorMsg(''); }}
            className={`py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              isCustomer 
                ? 'bg-gradient-to-r from-rosePrimary to-wineDeep text-white shadow-md' 
                : 'text-slate-500 hover:text-wineDeep'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Customer Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              !isCustomer 
                ? 'bg-wineDeep text-white shadow-md' 
                : 'text-slate-500 hover:text-wineDeep'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Admin Control</span>
          </button>
        </div>

        {/* Card Render */}
        <div className={`rounded-[32px] p-6 md:p-8 border shadow-glass-rose transition-all duration-300 ${
          isCustomer 
            ? 'bg-white/90 border-rosePrimary/15 backdrop-blur-2xl' 
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl border flex items-center space-x-2 text-xs font-medium mb-6 border-rose-200 bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isCustomer ? (
            /* Customer Account Portal Tab */
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rosePrimary/10 border border-rosePrimary/20 flex items-center justify-center mx-auto text-rosePrimary shadow-sm">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              
              <div className="space-y-1">
                <h2 className="font-heading font-extrabold text-2xl text-wineDeep">Customer Access</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Sign in to view and manage all your purchased AnKa surprise experiences.
                </p>
              </div>

              {/* Google Sign-In Container */}
              {isGoogleConfigured && (
                <div id="googleSignInBtnContainerLogin" className="w-full flex justify-center min-h-[44px]"></div>
              )}

              {isGoogleConfigured && (
                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">OR</span>
                </div>
              )}

              {/* Auth Mode Tab Selector */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-2xl border border-rosePrimary/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`py-2 rounded-xl transition-all ${authTab === 'login' ? 'bg-white text-rosePrimary shadow-sm' : 'text-slate-500 hover:text-wineDeep'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`py-2 rounded-xl transition-all ${authTab === 'register' ? 'bg-white text-rosePrimary shadow-sm' : 'text-slate-500 hover:text-wineDeep'}`}
                >
                  Create Account
                </button>
              </div>

              {/* Form 1: Customer Account Login */}
              {authTab === 'login' && (
                <form onSubmit={handleCustomerLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your-email@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rosePrimary/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Sign In To Account 🔑'}
                  </button>
                </form>
              )}

              {/* Form 2: Customer Account Register */}
              {authTab === 'register' && (
                <form onSubmit={handleCustomerRegisterSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-wineDeep uppercase tracking-wider mb-1.5">Create Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rosePrimary/20 rounded-2xl text-sm text-wineDeep placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rosePrimary shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rosePrimary/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account ✨'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-wineDeep/10 flex items-center justify-center mx-auto text-wineDeep mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                  Super-Admin Access
                </h2>
                <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">
                  Provide administrator credentials to manage packages, review analytics, track leads, and view purchases.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Admin Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Admin Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full py-3.5 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-semibold rounded-2xl shadow-sm transition-colors flex items-center justify-center space-x-1.5 focus:outline-none disabled:opacity-50 uppercase tracking-wider cursor-pointer"
              >
                <span>{loading ? 'Entering Portal...' : 'Admin Login'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>

      </div>

      {showConflictModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-800">
            <div className="flex items-center space-x-2 border-b border-rosePrimary/5 pb-3">
              <ShieldAlert className="w-6 h-6 text-rosePrimary animate-pulse" />
              <h3 className="font-heading font-black text-wineDeep text-lg">Admin Device Limit Reached</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Exactly 1 Laptop/Desktop and 1 Mobile session are allowed simultaneously. Max 2 active devices.
              Select an active device session to terminate below, or cancel.
            </p>

            <div className="space-y-3">
              {conflictSessions.map((session) => (
                <div key={session.deviceId} className="flex justify-between items-center p-3.5 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 text-xs">
                  <div className="text-left space-y-1">
                    <span className="font-bold text-wineDeep uppercase tracking-wider">
                      {session.deviceType === 'mobile' ? '📱 Mobile Device' : '💻 Laptop / Desktop'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-light leading-snug">
                      OS: {session.os} | Browser: {session.browser}
                    </p>
                    <p className="text-[10px] text-slate-400 font-light leading-snug">
                      Active: {new Date(session.lastActiveTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdminSubmit(null, session.deviceId)}
                    className="px-3 py-1.5 bg-rosePrimary hover:bg-rose-600 text-white font-bold uppercase rounded-lg transition-colors cursor-pointer text-[9px] tracking-wider"
                  >
                    Force Logout
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-rosePrimary/5">
              <button
                onClick={() => setShowConflictModal(false)}
                className="px-4.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold uppercase rounded-xl transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
