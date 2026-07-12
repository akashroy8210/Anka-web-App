const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  generateAIMemoryDescription,
  generateAILetter,
  generateAIText
} = require('../controllers/categories');
const { verifyAdmin, verifyAnyUser } = require('../middleware/auth');

// Public
router.get('/', getCategories);
router.post('/ai-memory-description', verifyAnyUser, generateAIMemoryDescription);
router.post('/ai-letter', verifyAnyUser, generateAILetter);
router.post('/ai-text', verifyAnyUser, generateAIText);
router.get('/:slug', getCategoryBySlug);

// Admin Only
router.post('/', verifyAdmin, createCategory);
router.put('/:id', verifyAdmin, updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

module.exports = router;
