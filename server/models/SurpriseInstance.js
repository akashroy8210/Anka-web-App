const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: true
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
    enum: ['Basic', 'Premium', 'Deluxe'],
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Content Added', 'Live'],
    default: 'Paid'
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
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

// Hash password before saving
SurpriseInstanceSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
SurpriseInstanceSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('SurpriseInstance', SurpriseInstanceSchema);
