const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate, updateTemplate, deleteTemplate } = require('../controllers/templates');
const { verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', getTemplates);

// Admin Only
router.post('/', verifyAdmin, createTemplate);
router.put('/:id', verifyAdmin, updateTemplate);
router.delete('/:id', verifyAdmin, deleteTemplate);

module.exports = router;
