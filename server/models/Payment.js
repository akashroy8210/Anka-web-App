const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  instanceId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'captured', 'failed'],
    default: 'created'
  },
  
  // Secure Metadata storage to prevent frontend verification tampering
  customerName: {
    type: String
  },
  customerEmail: {
    type: String
  },
  customerPhone: {
    type: String
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SurpriseCategory'
  },
  demoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demo'
  },
  tier: {
    type: String,
    enum: ['Basic', 'Premium', 'Deluxe']
  },
  generatedPassword: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
