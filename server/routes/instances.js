const express = require('express');
const router = express.Router();
const {
  getLiveInstance,
  getInstanceDetails,
  updateInstanceConfig,
  getAllInstances,
  deleteInstance,
  submitRecipientResponse,
  submitAdminResponse
} = require('../controllers/instances');
const { verifyAdmin, verifyCustomerInstance } = require('../middleware/auth');

// Public live surprise web page
router.get('/live/:instanceId', getLiveInstance);
router.post('/live/:instanceId/response', submitRecipientResponse);

// Scoped (Customer Mini Panel / Admin impersonate)
router.get('/:instanceId', verifyCustomerInstance, getInstanceDetails);
router.put('/:instanceId', verifyCustomerInstance, updateInstanceConfig);
router.post('/:instanceId/admin-response', verifyAdmin, submitAdminResponse);

// Admin Only
router.get('/', verifyAdmin, getAllInstances);
router.delete('/:id', verifyAdmin, deleteInstance);

module.exports = router;
