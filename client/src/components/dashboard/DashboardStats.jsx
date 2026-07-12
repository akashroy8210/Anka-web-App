import React from 'react';
import { DollarSign, ShoppingBag, Award } from 'lucide-react';

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign },
          { label: 'Bookings (This Month)', value: stats.bookingsThisMonth, icon: ShoppingBag },
          { label: 'Popular Surprise Category', value: stats.mostBookedCategory, icon: Award }
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{kpi.label}</span>
                <span className="mt-2 font-heading font-extrabold text-3xl text-wineDeep block">{kpi.value}</span>
              </div>
              <div className="p-4 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 shrink-0">
                <Icon className="w-6 h-6 text-rosePrimary" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3">Surprise Status Analytics</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 font-light">Draft (Paid but no customization)</span>
            <span className="font-bold text-slate-800">{stats.statusCounts?.Paid || 0}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 font-light">Customized (Content Added)</span>
            <span className="font-bold text-slate-800">{stats.statusCounts?.ContentAdded || 0}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 font-light">Published Live</span>
            <span className="font-bold text-green-600">{stats.statusCounts?.Live || 0}</span>
          </div>
        </div>
      </div>

      {stats.eventStats && (
        <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-rosePrimary/5 pb-3">
            <h3 className="font-heading font-bold text-lg text-wineDeep">User Engagement & Conversion Tracking</h3>
            <span className="bg-rosePrimary/10 text-rosePrimary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-rosePrimary/10">
              Total Logged Events: {stats.eventStats.total}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: '📺 Demos Viewed', count: stats.eventStats.breakdown?.['Demo viewed'] || 0, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
              { label: '📦 Packages Selected', count: stats.eventStats.breakdown?.['Package selected'] || 0, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: '🛒 Checkouts Started', count: stats.eventStats.breakdown?.['Checkout started'] || 0, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { label: '💳 Payments Completed', count: stats.eventStats.breakdown?.['Payment completed'] || 0, color: 'text-green-600 bg-green-50 border-green-200' },
              { label: '✨ Surprises Created', count: stats.eventStats.breakdown?.['Surprise created'] || 0, color: 'text-rose-600 bg-rose-50 border-rose-200' },
              { label: '👀 Surprises Opened', count: stats.eventStats.breakdown?.['Surprise viewed'] || 0, color: 'text-teal-600 bg-teal-50 border-teal-200' },
            ].map((event, i) => (
              <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 transition-all hover:shadow-sm ${event.color}`}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">{event.label}</span>
                <span className="font-heading font-black text-2xl">{event.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
