const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  demoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demo',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    default: ''
  },
  customerName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', RatingSchema);
