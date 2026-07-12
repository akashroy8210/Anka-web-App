const mongoose = require('mongoose');

const AnalyticsEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    enum: [
      'Demo viewed',
      'Package selected',
      'Checkout started',
      'Payment completed',
      'Surprise created',
      'Surprise viewed'
    ]
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  categorySlug: {
    type: String,
    trim: true
  },
  themeSlug: {
    type: String,
    trim: true
  },
  tier: {
    type: String,
    enum: ['Basic', 'Premium', 'Deluxe', 'none', null]
  },
  price: {
    type: Number,
    default: 0
  },
  instanceId: {
    type: String,
    trim: true
  },
  sessionId: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

module.exports = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
