const mongoose = require('mongoose');
const TierSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Basic', 'Premium'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  inclusions: [String],
  limits: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});
const DemoSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SurpriseCategory',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  tiers: [TierSchema],
  liveDemoUrl: {
    type: String,
    required: true
  },
  categorySlug: {
   type: String,
    required: true
  },
  themeSlug: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  ratingAverage: {
    type: Number,
    default: 4.5
  },
  ratingCount: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Demo', DemoSchema);
