const express = require('express');
const router = express.Router();
const { 
  adminLogin, 
  customerAccountRegister,
  customerAccountLogin,
  customerGoogleAuth,
  recoverCustomerPassword, 
  adminChangePassword, 
  getAdminSessions, 
  revokeAdminSession 
} = require('../controllers/auth');
const { verifyAdmin } = require('../middleware/auth');

router.post('/admin/login', adminLogin);
router.post('/customer/account-register', customerAccountRegister);
router.post('/customer/account-login', customerAccountLogin);
router.post('/customer/google', customerGoogleAuth);
router.post('/customer/recover', recoverCustomerPassword);
router.post('/admin/change-password', verifyAdmin, adminChangePassword);
router.get('/admin/sessions', verifyAdmin, getAdminSessions);
router.delete('/admin/sessions/:id', verifyAdmin, revokeAdminSession);

module.exports = router;
