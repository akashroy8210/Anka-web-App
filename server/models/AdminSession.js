const mongoose = require('mongoose');

const AdminSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceType: {
    type: String, // 'desktop' or 'mobile'
    required: true
  },
  browser: {
    type: String,
    default: 'Unknown'
  },
  os: {
    type: String,
    default: 'Unknown'
  },
  ip: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  lastActiveTime: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminSession', AdminSessionSchema);
