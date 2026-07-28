import React from 'react';

export default function PageSkeleton({ type = 'default' }) {
  if (type === 'home') {
    return (
      <div className="min-h-screen bg-creamBase/20 animate-pulse pt-20 pb-16 px-4 max-w-7xl mx-auto space-y-12 select-none">
        {/* Header Hero Shimmer */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-8">
          <div className="h-6 w-40 bg-rose-200/50 rounded-full mx-auto" />
          <div className="h-12 w-3/4 bg-rose-300/40 rounded-2xl mx-auto" />
          <div className="h-4 w-2/3 bg-slate-200/60 rounded-xl mx-auto" />
          <div className="h-12 w-80 bg-white border border-rose-100 rounded-2xl mx-auto shadow-sm" />
        </div>

        {/* 3 Category Cards Geometry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-white/70 border border-rose-100/60 rounded-[32px] p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="h-44 bg-rose-100/40 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-5 w-2/3 bg-rose-200/40 rounded-xl" />
                <div className="h-4 w-5/6 bg-slate-100/70 rounded-xl" />
              </div>
              <div className="h-10 w-full bg-rose-200/30 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'surprises') {
    return (
      <div className="min-h-screen bg-creamBase/20 animate-pulse pt-24 pb-16 px-4 max-w-7xl mx-auto space-y-12 select-none">
        {/* Title & Filter Pills */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="h-10 w-64 bg-rose-200/40 rounded-2xl mx-auto" />
          <div className="h-4 w-80 bg-slate-200/50 rounded-xl mx-auto" />
          <div className="flex justify-center space-x-2 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-rose-100/60 rounded-full" />
            ))}
          </div>
        </div>

        {/* Category Grid Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-white/75 border border-rose-100/70 rounded-[32px] p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="h-48 bg-rose-100/50 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-rose-200/50 rounded-xl" />
                <div className="h-4 w-full bg-slate-100/80 rounded-xl" />
              </div>
              <div className="h-11 w-full bg-rose-200/30 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div className="min-h-screen bg-[#FFF7F5] animate-pulse p-6 md:p-12 space-y-10 max-w-7xl mx-auto select-none pt-24">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="h-6 w-36 bg-rose-200/50 rounded-full mx-auto" />
          <div className="h-12 w-80 bg-wineDeep/10 rounded-2xl mx-auto" />
          <div className="h-4 w-96 bg-slate-200/60 rounded-xl mx-auto" />
        </div>

        {/* Theme Grid Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-white/80 border border-rose-100/70 rounded-[32px] p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="h-44 bg-rose-100/40 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-5 w-2/3 bg-rose-200/50 rounded-xl" />
                <div className="h-4 w-1/2 bg-slate-100/70 rounded-xl" />
              </div>
              <div className="h-10 w-full bg-wineDeep/10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'customizer') {
    return (
      <div className="min-h-screen bg-slate-50 animate-pulse p-6 max-w-5xl mx-auto space-y-8 pt-20 select-none">
        {/* Form Tabs Bar */}
        <div className="flex space-x-3 overflow-x-auto pb-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-slate-200/60 rounded-2xl shrink-0" />
          ))}
        </div>

        {/* Card Container Shimmer */}
        <div className="bg-white p-8 rounded-[36px] border border-slate-100 space-y-6 shadow-sm">
          <div className="h-6 w-56 bg-slate-200/60 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-100/80 rounded-xl" />
            <div className="h-12 bg-slate-100/80 rounded-xl" />
          </div>
          <div className="h-28 bg-slate-100/70 rounded-2xl" />
          <div className="h-12 w-48 bg-rose-200/40 rounded-2xl mx-auto" />
        </div>
      </div>
    );
  }

  if (type === 'site') {
    return (
      <div className="min-h-screen bg-[#0B0813] flex flex-col items-center justify-center p-6 animate-pulse select-none relative overflow-hidden">
        {/* Living Backdrop Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/20 via-purple-950/20 to-slate-950/40" />

        {/* Envelope/Card Silhouette */}
        <div className="relative z-10 w-full max-w-md p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-md space-y-6 text-center shadow-2xl">
          <div className="w-20 h-20 bg-rose-500/20 rounded-full mx-auto flex items-center justify-center border border-rose-500/30">
            <div className="w-10 h-10 bg-rose-400/30 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-rose-200/20 rounded-full mx-auto" />
            <div className="h-4 w-64 bg-slate-400/10 rounded-full mx-auto" />
          </div>
          <div className="h-12 w-40 bg-rose-500/20 rounded-2xl mx-auto border border-rose-500/30" />
        </div>
      </div>
    );
  }

  // Default clean glass card shimmer
  return (
    <div className="min-h-[65vh] flex items-center justify-center p-6 animate-pulse select-none">
      <div className="w-full max-w-md p-8 rounded-[32px] bg-white/60 border border-rose-100/60 space-y-5 shadow-sm text-center">
        <div className="w-14 h-14 bg-rose-100/50 rounded-2xl mx-auto" />
        <div className="h-5 w-48 bg-slate-200/60 rounded-xl mx-auto" />
        <div className="h-4 w-64 bg-slate-100/80 rounded-xl mx-auto" />
      </div>
    </div>
  );
}
