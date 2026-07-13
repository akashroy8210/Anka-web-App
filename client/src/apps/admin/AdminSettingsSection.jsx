import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.service';
import { Key, Eye, EyeOff, Check, AlertCircle, Smartphone, Laptop, Trash2 } from 'lucide-react';

export default function AdminSettingsSection({ token }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [sessions, setSessions] = useState([]);
  const [fetchingSessions, setFetchingSessions] = useState(false);

  const fetchSessions = async () => {
    setFetchingSessions(true);
    try {
      const data = await api.getAdminSessions(token);
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setFetchingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  const handleRevokeSession = async (deviceId) => {
    if (!window.confirm("Are you sure you want to log out this device session?")) return;
    try {
      const data = await api.revokeAdminSession(deviceId, token);
      if (data.success) {
        setSessions(sessions.filter(s => s.deviceId !== deviceId));
        alert("Session revoked successfully.");
      } else {
        alert(data.message || "Failed to revoke session.");
      }
    } catch (err) {
      console.error(err);
      alert("Error revoking session.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.changeAdminPassword(currentPassword, newPassword, token);
      if (data.success) {
        setSuccessMsg('Admin password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(data.message || 'Failed to change admin password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error changing admin password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto animate-fade-in">
      
      {/* Change Password Card */}
      <div className="bg-white/80 border border-rosePrimary/10 p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col justify-between">
        <div>
          <div className="text-center mb-6">
            <h2 className="font-heading font-extrabold text-xl text-[#4A0512]">Change Admin Password</h2>
            <p className="text-[11px] text-slate-400 font-light mt-1">
              Provide your current administrator password to configure a new access credential.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-605 text-xs font-semibold mb-5 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl border border-green-200 bg-green-50 text-green-700 text-xs font-semibold mb-5 flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-rosePrimary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-rosePrimary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-rosePrimary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-semibold rounded-2xl shadow-md transition-colors flex items-center justify-center space-x-1.5 focus:outline-none disabled:opacity-50 uppercase tracking-wider cursor-pointer"
            >
              <span>{loading ? 'Updating Password...' : 'Change Password'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Active Sessions Panel */}
      <div className="bg-white/80 border border-rosePrimary/10 p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col space-y-5 text-slate-800">
        <div className="text-center">
          <h2 className="font-heading font-extrabold text-xl text-[#4A0512]">Active Login Sessions</h2>
          <p className="text-[11px] text-slate-400 font-light mt-1">
            Manage your currently active administrator sessions.
          </p>
        </div>

        {fetchingSessions ? (
          <p className="text-xs text-slate-400 font-light text-center py-8">Fetching active device logins...</p>
        ) : sessions.length === 0 ? (
          <p className="text-xs text-slate-400 font-light text-center py-8">No active sessions tracked.</p>
        ) : (
          <div className="space-y-3.5">
            {sessions.map((sess) => (
              <div key={sess.deviceId} className="flex justify-between items-center p-4 bg-rosePrimary/5 border border-rosePrimary/10 rounded-2xl">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2.5 bg-white rounded-xl border border-rosePrimary/5">
                    {sess.deviceType === 'mobile' ? (
                      <Smartphone className="w-4 h-4 text-rosePrimary" />
                    ) : (
                      <Laptop className="w-4 h-4 text-rosePrimary" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-wineDeep uppercase tracking-wide">
                      {sess.deviceType === 'mobile' ? 'Mobile Session' : 'Desktop Session'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-light leading-snug">
                      OS: {sess.os} | Browser: {sess.browser}
                    </p>
                    <p className="text-[9px] text-rosePrimary font-medium">
                      Last Active: {new Date(sess.lastActiveTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRevokeSession(sess.deviceId)}
                  className="p-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Revoke and Logout Device"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
