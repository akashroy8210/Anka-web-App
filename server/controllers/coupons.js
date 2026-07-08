const Coupon = require('../models/Coupon');

// Public: Validate coupon code during checkout
exports.validateCoupon = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
  }

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon code is no longer active.' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired.' });
    }

    res.json({
      success: true,
      message: 'Coupon code applied successfully!',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error validating coupon.' });
  }
};

// Admin: Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching coupons.' });
  }
};

// Admin: Create a coupon
exports.createCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, isActive } = req.body;

  if (!code || !discountType || !discountValue) {
    return res.status(400).json({ success: false, message: 'Code, discount type, and discount value are required.' });
  }

  try {
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon with this code already exists.' });
    }

    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true
    });

    await newCoupon.save();
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating coupon.' });
  }
};

// Admin: Update a coupon
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    res.json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating coupon.' });
  }
};

// Admin: Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }
    res.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting coupon.' });
  }
};
