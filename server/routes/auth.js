const express = require('express');
const router = express.Router();
const { adminLogin, customerLogin, adminChangePassword } = require('../controllers/auth');
const { verifyAdmin } = require('../middleware/auth');

router.post('/admin/login', adminLogin);
router.post('/customer/login', customerLogin);
router.post('/admin/change-password', verifyAdmin, adminChangePassword);

module.exports = router;
