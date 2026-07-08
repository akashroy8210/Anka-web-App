const express = require('express');
const router = express.Router();
const { adminLogin, customerLogin } = require('../controllers/auth');

router.post('/admin/login', adminLogin);
router.post('/customer/login', customerLogin);

module.exports = router;
