import React, { useState } from 'react';
import { api } from '../../services/api.service';
import { Key, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

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
    <div className="max-w-md mx-auto bg-white/80 border border-rosePrimary/10 p-6 md:p-8 rounded-[32px] shadow-sm animate-fade-in">
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
  );
}
