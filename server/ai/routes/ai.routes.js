const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyAnyUser } = require('../../middleware/auth');

router.post('/generate', verifyAnyUser, aiController.generateText);
router.get('/status', verifyAnyUser, aiController.getStatus);

module.exports = router;
