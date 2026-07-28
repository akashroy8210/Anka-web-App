import { useState } from 'react';
import { couponService } from '../services/coupon.service';

export function useCoupons(initialCoupons) {
  const [coupons, setCoupons] = useState(initialCoupons || []);
  
  // Coupon Form state
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percentage');
  const [newValue, setNewValue] = useState(10);
  const [newMaxUsage, setNewMaxUsage] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleCreateCoupon = async (e, token) => {
    if (e) e.preventDefault();
    if (!newCode || !newValue) return;

    try {
      const res = await couponService.createCoupon({
        code: newCode,
        discountType: newType,
        discountValue: newValue,
        maxUsage: newMaxUsage !== '' && newMaxUsage !== null ? Number(newMaxUsage) : null,
        expiryDate: newExpiry ? new Date(newExpiry) : null
      }, token);

      if (res.success) {
        setCoupons([res.coupon, ...coupons]);
        setNewCode('');
        setNewMaxUsage('');
        setNewExpiry('');
        alert('Coupon created successfully!');
      } else {
        alert(res.message || 'Error creating coupon');
      }
    } catch (err) {
      alert('Network error creating coupon');
    }
  };

  const handleUpdateCoupon = async (id, updateData, token) => {
    try {
      const res = await couponService.updateCoupon(id, updateData, token);
      if (res.success && res.coupon) {
        setCoupons(coupons.map(c => c._id === id ? res.coupon : c));
        return { success: true, coupon: res.coupon };
      } else {
        alert(res.message || 'Error updating coupon');
        return { success: false };
      }
    } catch (err) {
      alert('Network error updating coupon');
      return { success: false };
    }
  };

  const handleDeleteCoupon = async (id, token) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await couponService.deleteCoupon(id, token);
      if (res.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      alert('Error deleting coupon');
    }
  };

  return {
    coupons,
    setCoupons,
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
    handleDeleteCoupon,
  };
}
