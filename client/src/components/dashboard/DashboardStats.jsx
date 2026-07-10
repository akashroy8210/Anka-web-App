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
    </div>
  );
}
