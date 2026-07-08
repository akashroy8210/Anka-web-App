const express = require('express');
const router = express.Router();
const { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/coupons');
const { verifyAdmin } = require('../middleware/auth');

// Public
router.post('/validate', validateCoupon);

// Admin Only
router.get('/', verifyAdmin, getAllCoupons);
router.post('/', verifyAdmin, createCoupon);
router.put('/:id', verifyAdmin, updateCoupon);
router.delete('/:id', verifyAdmin, deleteCoupon);

module.exports = router;
