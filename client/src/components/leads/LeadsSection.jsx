import React from 'react';
import { Phone, Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function LeadsSection({ leads, token, handleUpdateLeadStatus, handleDeleteLead }) {
  return (
    <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden animate-fade-in-up">
      <div className="px-6 py-4 border-b border-rosePrimary/5">
        <h3 className="font-heading font-bold text-lg text-wineDeep">On-Demand Custom Surprise Requests</h3>
      </div>
      
      {leads.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500">
                <th className="p-4">Customer</th>
                <th className="p-4">WhatsApp / Phone</th>
                <th className="p-4">Custom Idea description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{lead.name}</td>
                  <td className="p-4 font-semibold text-slate-700">
                    <a href={`tel:${lead.phone}`} className="hover:underline flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </a>
                  </td>
                  <td className="p-4 max-w-sm text-slate-650 font-light leading-relaxed whitespace-pre-wrap">{lead.message}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      lead.status === 'Closed'
                        ? 'bg-slate-100 border-slate-300 text-slate-500'
                        : lead.status === 'Quoted'
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : lead.status === 'Contacted'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'bg-rose-50 border-rose-200 text-rosePrimary'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-y-1.5">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {['Contacted', 'Quoted', 'Closed'].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleUpdateLeadStatus(lead._id, s, token)}
                          className={`px-2 py-1 rounded-lg border text-[10px] font-semibold uppercase tracking-wider cursor-pointer ${
                            lead.status === s
                              ? 'bg-slate-200 border-slate-300 text-slate-800'
                              : 'bg-white hover:bg-slate-50 text-slate-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        onClick={() => handleDeleteLead(lead._id, token)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No custom inquiries found." />
      )}
    </div>
  );
}
