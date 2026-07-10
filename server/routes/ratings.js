const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Demo = require('../models/Demo');

// Public: Get reviews/ratings (highest score first)
router.get('/', async (req, res) => {
  try {
    const { categoryId, demoId } = req.query;
    let query = {};
    if (demoId) {
      query.demoId = demoId;
    } else if (categoryId) {
      const demos = await Demo.find({ categoryId });
      const demoIds = demos.map(d => d._id);
      query.demoId = { $in: demoIds };
    }
    const ratings = await Rating.find(query).sort({ score: -1, createdAt: -1 });
    res.json({ success: true, ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching ratings.' });
  }
});

// Public/Customer: Submit a review rating
router.post('/', async (req, res) => {
  const { demoId, score, reviewText, customerName } = req.body;
  
  if (!demoId || !score || !customerName) {
    return res.status(400).json({ success: false, message: 'Demo ID, rating score, and your name are required.' });
  }

  try {
    const newRating = new Rating({
      demoId,
      score,
      reviewText,
      customerName
    });

    await newRating.save();

    // Recalculate average rating for the Demo
    const allRatings = await Rating.find({ demoId });
    const count = allRatings.length;
    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / count;

    await Demo.findByIdAndUpdate(demoId, {
      ratingAverage: parseFloat(avg.toFixed(1)),
      ratingCount: count
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully!', rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error submitting review.' });
  }
});

module.exports = router;
