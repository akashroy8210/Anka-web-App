const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, createUpgradeOrder, verifyUpgrade } = require('../controllers/payments');
const { verifyAnyUser } = require('../middleware/auth');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/create-upgrade-order', verifyAnyUser, createUpgradeOrder);
router.post('/verify-upgrade', verifyAnyUser, verifyUpgrade);

module.exports = router;
