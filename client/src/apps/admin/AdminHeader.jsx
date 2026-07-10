import React from 'react';
import { ShieldCheck, RefreshCw, LogOut } from 'lucide-react';

export default function AdminHeader({ refreshing, fetchAllData, handleLogout }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b mb-8 gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-rosePrimary/15 text-rosePrimary rounded-2xl shadow-sm">
          <ShieldCheck className="w-6 h-6 animate-pulse-glow" />
        </div>
        <div className="text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Core</span>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-wineDeep">
            AnKa Main Admin Panel
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <button
          onClick={fetchAllData}
          disabled={refreshing}
          className="flex-grow sm:flex-grow-0 p-2.5 bg-white border border-rosePrimary/10 text-slate-500 hover:text-wineDeep rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
