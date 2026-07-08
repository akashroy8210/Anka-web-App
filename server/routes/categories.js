const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  generateAIMemoryDescription,
  generateAILetter
} = require('../controllers/categories');
const { verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', getCategories);
router.post('/ai-memory-description', generateAIMemoryDescription);
router.post('/ai-letter', generateAILetter);
router.get('/:slug', getCategoryBySlug);

// Admin Only
router.post('/', verifyAdmin, createCategory);
router.put('/:id', verifyAdmin, updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

module.exports = router;
