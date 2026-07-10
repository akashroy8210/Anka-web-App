import React from 'react';

export default function Loading({ message = 'Authenticating super admin dashboard...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-4">
      <div className="w-10 h-10 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
      <p className="text-slate-500 font-light text-sm">{message}</p>
    </div>
  );
}
