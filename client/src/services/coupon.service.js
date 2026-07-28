import { api } from './api.service';

export const couponService = {
  getCoupons: api.getCoupons,
  createCoupon: api.createCoupon,
  updateCoupon: api.updateCoupon,
  deleteCoupon: api.deleteCoupon,
  validateCoupon: api.validateCoupon,
};
