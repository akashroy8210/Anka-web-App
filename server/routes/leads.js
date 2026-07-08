const express = require('express');
const router = express.Router();
const { createLead, getAllLeads, updateLeadStatus, deleteLead } = require('../controllers/leads');
const { verifyAdmin } = require('../middleware/auth');

// Public
router.post('/', createLead);

// Admin Only
router.get('/', verifyAdmin, getAllLeads);
router.put('/:id', verifyAdmin, updateLeadStatus);
router.delete('/:id', verifyAdmin, deleteLead);

module.exports = router;
