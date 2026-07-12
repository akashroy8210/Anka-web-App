const express = require('express');
const router = express.Router();
const { getDashboardStats, trackEvent } = require('../controllers/analytics');
const { verifyAdmin } = require('../middleware/auth');

router.get('/stats', verifyAdmin, getDashboardStats);
router.post('/track', trackEvent);

module.exports = router;
