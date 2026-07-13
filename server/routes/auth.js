const express = require('express');
const router = express.Router();
const { adminLogin, customerLogin, adminChangePassword, getAdminSessions, revokeAdminSession } = require('../controllers/auth');
const { verifyAdmin } = require('../middleware/auth');

router.post('/admin/login', adminLogin);
router.post('/customer/login', customerLogin);
router.post('/admin/change-password', verifyAdmin, adminChangePassword);
router.get('/admin/sessions', verifyAdmin, getAdminSessions);
router.delete('/admin/sessions/:id', verifyAdmin, revokeAdminSession);

module.exports = router;
