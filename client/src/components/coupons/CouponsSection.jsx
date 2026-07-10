import React from 'react';
import { Tag, Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function CouponsSection({
  coupons,
  token,
  newCode,
  setNewCode,
  newType,
  setNewType,
  newValue,
  setNewValue,
  newExpiry,
  setNewExpiry,
  handleCreateCoupon,
  handleDeleteCoupon
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
      {/* Create Promo Coupon Form */}
      <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm h-fit">
        <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3 mb-4">Create Promo Coupon</h3>
        
        <form onSubmit={(e) => handleCreateCoupon(e, token)} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Coupon Code</label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. LOVE20"
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Discount Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="flat">Flat Cash Discount (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Discount Value</label>
            <input
              type="number"
              required
              value={newValue}
              onChange={(e) => setNewValue(Number(e.target.value))}
              placeholder="Value"
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Expiry Date (Optional)</label>
            <input
              type="date"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Tag className="w-4 h-4" />
            <span>Generate Promo Coupon</span>
          </button>
        </form>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden lg:col-span-2">
        <div className="px-6 py-4 border-b border-rosePrimary/5">
          <h3 className="font-heading font-bold text-lg text-wineDeep">Active Coupons</h3>
        </div>
        
        {coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500">
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-wineDeep uppercase">{c.code}</td>
                    <td className="p-4 font-semibold text-slate-800">
                      {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}
                    </td>
                    <td className="p-4 text-slate-500 font-light font-sans text-xs">
                      {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id, token)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
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
          <EmptyState message="No coupons found." />
        )}
      </div>
    </div>
  );
}
