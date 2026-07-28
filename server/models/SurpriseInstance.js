const mongoose = require('mongoose');

const SelectedAddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const SurpriseInstanceSchema = new mongoose.Schema({
  instanceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customSlug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SurpriseCategory',
    required: true
  },
  demo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demo'
  },
  ratingSubmitted: {
    type: Boolean,
    default: false
  },
  tier: {
    type: String,
    enum: ['Basic', 'Premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Content Added', 'Live', 'Draft', 'Archived'],
    default: 'Paid'
  },
  archived: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  ownerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  pricePaid: {
    type: Number,
    required: true
  },
  addonsSelected: [SelectedAddonSchema],
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      recipientName: 'My Special Someone',
      senderName: 'With Love',
      message: 'Happy Surprise! You mean the world to me.',
      themeColor: '#E11D48',
      photos: [],
      songChoice: 'romantic'
    }
  },
  recipientResponse: {
    type: String,
    default: ''
  },
  proposalStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Accepted', 'Thinking', 'Rejected']
  },
  proposalAcceptanceTime: {
    type: Date,
    default: null
  },
  adminResponse: {
    type: String,
    default: ''
  },
  feedbackLiked: {
    type: Boolean,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook: Set tier-based hosting expiration if not set
SurpriseInstanceSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const baseDate = this.createdAt ? new Date(this.createdAt) : new Date();
    const expiry = new Date(baseDate);
    if ((this.tier || '').toLowerCase() === 'premium') {
      expiry.setFullYear(expiry.getFullYear() + 1); // 1 Year for Premium Tier
    } else {
      expiry.setMonth(expiry.getMonth() + 1); // 1 Month for Basic Tier
    }
    this.expiresAt = expiry;
  }
  next();
});

module.exports = mongoose.model('SurpriseInstance', SurpriseInstanceSchema);
