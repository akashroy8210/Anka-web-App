import React from 'react';

export default function PageSkeleton({ type = 'default' }) {
  if (type === 'category') {
    return (
      <div className="min-h-screen bg-[#FFF7F5] animate-pulse p-6 md:p-12 space-y-8 max-w-7xl mx-auto">
        <div className="h-12 w-64 bg-rose-200/40 rounded-2xl mx-auto" />
        <div className="h-4 w-96 bg-rose-100/50 rounded-xl mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-white/60 border border-rose-100/60 rounded-3xl p-4 space-y-4 shadow-sm">
              <div className="h-40 bg-rose-100/40 rounded-2xl" />
              <div className="h-5 w-3/4 bg-rose-200/40 rounded-xl" />
              <div className="h-4 w-1/2 bg-rose-100/50 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'customizer') {
    return (
      <div className="min-h-screen bg-slate-50 animate-pulse p-6 max-w-5xl mx-auto space-y-6 pt-12">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-slate-200/60 rounded-xl shrink-0" />
          ))}
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-6 shadow-sm">
          <div className="h-6 w-48 bg-slate-200/60 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
          <div className="h-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (type === 'site') {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex flex-col items-center justify-center p-6 animate-pulse select-none">
        <div className="w-20 h-20 bg-rose-500/20 rounded-full mb-6" />
        <div className="h-6 w-64 bg-rose-300/20 rounded-full mb-3" />
        <div className="h-4 w-48 bg-rose-200/10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 animate-pulse">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/40 border border-slate-100 space-y-4 shadow-sm text-center">
        <div className="w-12 h-12 bg-rose-100 rounded-2xl mx-auto" />
        <div className="h-5 w-48 bg-slate-200/60 rounded-xl mx-auto" />
        <div className="h-4 w-64 bg-slate-100 rounded-xl mx-auto" />
      </div>
    </div>
  );
}
