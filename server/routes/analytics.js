const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analytics');
const { verifyAdmin } = require('../middleware/auth');

router.get('/stats', verifyAdmin, getDashboardStats);

module.exports = router;
