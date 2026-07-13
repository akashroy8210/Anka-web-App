const mongoose = require('mongoose');

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
  liveDemoUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  themeSlug: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  features: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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
