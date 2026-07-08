const mongoose = require('mongoose');

const WebsiteTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  features: [String]
});

const WebsiteTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Wedding', 'Shop', 'School', 'Coaching'],
    required: true
  },
  description: String,
  liveDemoUrl: String,
  imageUrl: String,
  pricingTiers: [WebsiteTierSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WebsiteTemplate', WebsiteTemplateSchema);
