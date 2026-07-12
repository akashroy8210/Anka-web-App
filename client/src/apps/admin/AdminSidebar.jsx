import React from 'react';
import { DollarSign, Award, ShoppingBag, Tag, MessageSquare, Settings } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: DollarSign },
    { id: 'instances', label: 'Surprises', icon: ShoppingBag },
    { id: 'categories', label: 'Occasions & Demos', icon: Award },
    { id: 'leads', label: 'On-Demand Ideas', icon: MessageSquare },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8 bg-white/70 p-1.5 rounded-2xl border border-rosePrimary/10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-[10px] sm:text-xs font-semibold rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              isSelected
                ? 'bg-rosePrimary text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
