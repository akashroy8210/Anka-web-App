const mongoose = require('mongoose');

const TierSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Basic', 'Premium', 'Deluxe'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  inclusions: [String]
});

const AddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String
});

const SurpriseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  demoVideoUrl: String,
  liveDemoUrl: String,
  demoVideos: [
    {
      name: String,
      videoUrl: String,
      imageUrl: String,
      themeSlug: String,
      liveDemoUrl: String
    }
  ],
  imageUrl: String,
  images: [String],
  tiers: [TierSchema],
  addons: [AddonSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SurpriseCategory', SurpriseCategorySchema);
