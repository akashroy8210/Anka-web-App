const express = require('express');
const router = express.Router();
const Demo = require('../models/Demo');
const { verifyAdmin } = require('../middleware/auth');

// Admin: Create a new design theme demo
router.post('/', verifyAdmin, async (req, res) => {
  const { categoryId, name, videoUrl, imageUrl, liveDemoUrl, price, themeSlug, images } = req.body;

  if (!categoryId || !name || !videoUrl || !liveDemoUrl || price === undefined || !themeSlug) {
    return res.status(400).json({ success: false, message: 'All demo fields are required.' });
  }

  try {
    const newDemo = new Demo({
      categoryId,
      name,
      videoUrl,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
      images: images || [],
      liveDemoUrl,
      price,
      themeSlug,
      ratingAverage: 4.8,
      ratingCount: 10
    });

    await newDemo.save();
    res.status(201).json({ success: true, demo: newDemo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating surprise design.' });
  }
});

// Admin: Delete a design theme demo
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const demo = await Demo.findByIdAndDelete(req.params.id);
    if (!demo) {
      return res.status(404).json({ success: false, message: 'Surprise design demo not found.' });
    }
    res.json({ success: true, message: 'Surprise design demo deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting surprise design demo.' });
  }
});

// Admin: Update a design theme demo (change price, name, etc.)
router.put('/:id', verifyAdmin, async (req, res) => {
  console.log("PUT /api/demos/:id received body:", req.body);
  try {
    const demo = await Demo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    console.log("Updated demo in DB:", demo);
    if (!demo) {
      return res.status(404).json({ success: false, message: 'Surprise design demo not found.' });
    }
    res.json({ success: true, demo });
  } catch (err) {
    console.error("Error updating demo:", err);
    res.status(500).json({ success: false, message: 'Server error updating surprise design demo.' });
  }
});

module.exports = router;
