import React, { useState } from 'react';
import { Tag, Trash2, Edit3, CheckCircle, AlertCircle, Clock, ShieldX, X } from 'lucide-react';
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
  newMaxUsage,
  setNewMaxUsage,
  newExpiry,
  setNewExpiry,
  handleCreateCoupon,
  handleUpdateCoupon,
  handleDeleteCoupon
}) {
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editMaxUsage, setEditMaxUsage] = useState('');

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setEditMaxUsage(coupon.maxUsage !== null && coupon.maxUsage !== undefined ? String(coupon.maxUsage) : '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const val = editMaxUsage.trim() === '' ? null : Number(editMaxUsage);
    const res = await handleUpdateCoupon(editingCoupon._id, { maxUsage: val }, token);
    if (res?.success) {
      setEditingCoupon(null);
    }
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) {
      return { label: 'Disabled', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: ShieldX };
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { label: 'Expired', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
    }
    if (coupon.maxUsage !== null && coupon.maxUsage !== undefined && (coupon.currentUsage || 0) >= coupon.maxUsage) {
      return { label: 'Fully Redeemed', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle };
    }
    return { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
      {/* Create Promo Coupon Form */}
      <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm h-fit">
        <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3 mb-4">
          Create Promo Coupon
        </h3>
        
        <form onSubmit={(e) => handleCreateCoupon(e, token)} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">
              Coupon Code
            </label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. WELCOME50"
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">
              Discount Type
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Flat Cash Discount (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">
              Discount Value
            </label>
            <input
              type="number"
              required
              min={1}
              value={newValue}
              onChange={(e) => setNewValue(Number(e.target.value))}
              placeholder="e.g. 50"
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">
              Maximum Usage Limit (Optional)
            </label>
            <input
              type="number"
              min={1}
              value={newMaxUsage}
              onChange={(e) => setNewMaxUsage(e.target.value)}
              placeholder="Leave empty for unlimited (e.g. 50)"
              className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Leave blank for unlimited uses.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">
              Expiry Date (Optional)
            </label>
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

      {/* Coupons Table List */}
      <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden lg:col-span-2">
        <div className="px-6 py-4 border-b border-rosePrimary/5 flex justify-between items-center">
          <h3 className="font-heading font-bold text-lg text-wineDeep">Coupons Directory</h3>
          <span className="text-xs text-slate-400 font-semibold">{coupons.length} Total Coupons</span>
        </div>
        
        {coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Usage (Used / Max)</th>
                  <th className="p-4">Remaining</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                {coupons.map((c) => {
                  const status = getCouponStatus(c);
                  const StatusIcon = status.icon;
                  const currentCount = c.currentUsage || 0;
                  const hasLimit = c.maxUsage !== null && c.maxUsage !== undefined;
                  const remaining = hasLimit ? Math.max(0, c.maxUsage - currentCount) : 'Unlimited';

                  return (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-wineDeep uppercase">{c.code}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-700 font-medium">
                        {currentCount} / {hasLimit ? c.maxUsage : '∞'}
                      </td>
                      <td className="p-4 text-xs font-semibold">
                        {hasLimit ? (
                          <span className={remaining === 0 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                            {remaining} left
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">Unlimited</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(c)}
                          title="Edit Usage Limit"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 inline-block cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(c._id, token)}
                          title="Delete Coupon"
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No coupons found." />
        )}
      </div>

      {/* Quick Edit Max Usage Limit Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-rosePrimary/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-heading font-extrabold text-wineDeep text-lg">Edit Usage Limit</h4>
                <p className="text-xs text-slate-400 font-mono font-bold uppercase">{editingCoupon.code}</p>
              </div>
              <button
                onClick={() => setEditingCoupon(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">
                  Maximum Usage Limit
                </label>
                <input
                  type="number"
                  min={editingCoupon.currentUsage || 0}
                  value={editMaxUsage}
                  onChange={(e) => setEditMaxUsage(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  Current usage count is <span className="font-mono font-bold">{editingCoupon.currentUsage || 0}</span>.
                  Setting limit to empty makes it unlimited.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold uppercase rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rosePrimary hover:bg-wineDeep text-white font-bold uppercase rounded-xl text-xs shadow-sm cursor-pointer"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
