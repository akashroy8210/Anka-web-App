import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.service';
import { Key, User, ShieldAlert, Heart, Globe, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer'); // customer or admin

  // Customer credentials state
  const [instanceId, setInstanceId] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  // Admin credentials state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [conflictSessions, setConflictSessions] = useState([]);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // check is logined
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin');
    } else if (localStorage.getItem('customerToken')) {
      const instanceId = localStorage.getItem('instanceId');
      navigate(`/customizer/${instanceId}`);
    }else{
      navigate("/login");
    }
  }, [navigate]);
  
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await api.customerLogin(instanceId, customerPassword);
      if (data.success) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('instanceId', data.instance.instanceId);
        navigate(`/customizer/${data.instance.instanceId}`);
      } else {
        setErrorMsg(data.message || 'Invalid Instance ID or Password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to authentication server.');
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
        // Device limit conflict detected!
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

  const isSurprise = activeTab === 'customer';

  return (
    <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center px-4 transition-colors duration-500 ${
      isSurprise ? 'bg-creamBase/30' : 'bg-slate-50'
    }`}>
      
      {/* Background Orbs */}
      {isSurprise ? (
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-blushAccent/20 filter blur-3xl animate-float-slow -z-10"></div>
      ) : (
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-greenAccent/5 filter blur-3xl animate-float-reverse -z-10"></div>
      )}

      <div className="w-full max-w-md">
        
        {/* Toggle tabs */}
        <div className="flex border border-slate-200 bg-white p-1 rounded-2xl mb-6 shadow-sm">
          <button
            onClick={() => { setActiveTab('customer'); setErrorMsg(''); }}
            className={`flex-grow py-3 text-xs font-semibold rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
              isSurprise 
                ? 'bg-rosePrimary text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Edit Surprise</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`flex-grow py-3 text-xs font-semibold rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
              !isSurprise 
                ? 'bg-wineDeep text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Admin Control</span>
          </button>
        </div>

        {/* Login Card */}
        <div className={`rounded-3xl p-6 md:p-8 border shadow-md transition-all duration-300 ${
          isSurprise 
            ? 'glass-card-rose border-rosePrimary/15 bg-white/70' 
            : 'bg-white border-slate-200'
        }`}>
          
          <div className="text-center mb-6">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              {isSurprise ? 'Surprise Customizer' : 'Super-Admin Access'}
            </h2>
            <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">
              {isSurprise 
                ? 'Enter the credentials displayed on your payment receipt to configure templates, text, music, and upload photos.'
                : 'Provide administrator credentials to manage packages, review analytics, track leads, and view purchases.'
              }
            </p>
          </div>

          {errorMsg && (
            <div className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-medium mb-6 ${
              isSurprise ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-red-200 bg-red-50 text-red-600'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Render */}
          {isSurprise ? (
            /* Customer Login Form */
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Instance ID / Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={instanceId}
                    onChange={(e) => setInstanceId(e.target.value)}
                    placeholder="e.g. s-a8f273"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-rosePrimary/10 bg-white/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                  />
                  <Heart className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showCustomerPassword ? 'text' : 'password'}
                    required
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-rosePrimary/10 bg-white/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-semibold rounded-2xl shadow-md transition-colors flex items-center justify-center space-x-1.5 focus:outline-none disabled:opacity-50 uppercase tracking-wider"
              >
                <span>{loading ? 'Authenticating...' : 'Enter Customizer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
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
