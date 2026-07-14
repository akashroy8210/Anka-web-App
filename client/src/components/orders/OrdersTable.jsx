import React from 'react';
import { Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function OrdersTable({ instances, token, handleImpersonate, handleDeleteInstance, navigate }) {
  return (
    <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden animate-fade-in-up">
      <div className="px-6 py-4 border-b border-rosePrimary/5">
        <h3 className="font-heading font-bold text-lg text-wineDeep">Active Surprises</h3>
      </div>
      
      {instances.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500">
                <th className="p-4">Surprise ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Occasion / Vibe</th>
                <th className="p-4">Price Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {instances.map((inst) => (
                <tr key={inst._id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-wineDeep">{inst.instanceId}</td>
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-slate-800 text-sm">{inst.customerName || 'None'}</div>
                    <div className="text-slate-400 text-xs">{inst.customerEmail}</div>
                    <div className="text-xs text-slate-450">{inst.customerPhone}</div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-slate-800 text-sm">{inst.category ? (typeof inst.category === 'object' ? inst.category.name : inst.category) : 'Unknown'}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{inst.tier}</div>
                    {inst.category?.slug?.toLowerCase().includes('proposal') && (
                      <div className="mt-1 space-y-0.5 bg-rose-50/50 p-2 rounded-xl border border-rose-100 max-w-[180px] text-left">
                        <div className="text-[9px] uppercase font-bold text-rosePrimary flex items-center gap-1">
                          💍 Proposal Info:
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium">
                          Status: <span className={`font-bold ${
                            inst.proposalStatus === 'Accepted' ? 'text-green-600' :
                            inst.proposalStatus === 'Thinking' ? 'text-amber-500' : 'text-slate-500'
                          }`}>{inst.proposalStatus || 'Pending'}</span>
                        </div>
                        {inst.proposalAcceptanceTime && (
                          <div className="text-[9px] text-slate-400">
                            Time: {new Date(inst.proposalAcceptanceTime).toLocaleString()}
                          </div>
                        )}
                        {inst.recipientResponse && (
                          <div className="text-[9px] text-slate-500 italic max-w-full truncate">
                            "{inst.recipientResponse}"
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-750 text-sm">₹{inst.pricePaid}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      inst.status === 'Live'
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : inst.status === 'Content Added'
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-amber-50 border-amber-200 text-amber-600'
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 shrink-0">
                    <button
                      onClick={() => handleImpersonate(inst.instanceId, token, navigate)}
                      className="px-3.5 py-2 bg-slate-150 hover:bg-slate-200 text-rosePrimary rounded-lg font-bold border text-xs uppercase tracking-wider transition-colors inline-block cursor-pointer"
                    >
                      Edit Configs
                    </button>
                    <button
                      onClick={() => handleDeleteInstance(inst._id, token)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-655 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No surprise purchases found." />
      )}
    </div>
  );
}
