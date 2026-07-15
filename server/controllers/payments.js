const Razorpay = require('razorpay');
const crypto = require('crypto');
const SurpriseCategory = require('../models/SurpriseCategory');
const SurpriseInstance = require('../models/SurpriseInstance');
const Demo = require('../models/Demo');
const Coupon = require('../models/Coupon');
const Payment = require('../models/Payment');
const emailService = require('../services/emailService');

// Initialize Razorpay conditionally (falls back to mock if keys are missing)
let razorpay = null;
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (KEY_ID && KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET
    });
    console.log('Razorpay initialized in production/sandbox mode.');
  } catch (err) {
    console.error('Razorpay initialization failed. Falling back to Mock mode.', err);
  }
} else {
  console.log('No Razorpay credentials found. Running in MOCK checkout mode.');
}

// Generate secure random string
const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Create a payment order
exports.createOrder = async (req, res) => {
  const { demoId, categoryId, tierName, couponCode, customerEmail, customerName, customerPhone } = req.body;

  if (!demoId && !categoryId) {
    return res.status(400).json({ success: false, message: 'Demo ID is required.' });
  }

  try {
    let demo = null;
    let category = null;

    if (demoId) {
      demo = await Demo.findById(demoId).populate('categoryId');
      if (!demo) {
        return res.status(404).json({ success: false, message: 'Surprise design demo not found.' });
      }
      category = demo.categoryId;
    } else {
      category = await SurpriseCategory.findById(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Surprise category not found.' });
      }
    }

    let selectedTier = tierName || 'Basic';
    let totalAmount = 0;

    const categoryTier = category.tiers?.find(t => t.name === selectedTier);
    if (categoryTier && typeof categoryTier.price === 'number') {
      totalAmount = categoryTier.price;
    } else {
      return res.status(400).json({ success: false, message: 'Selected pricing tier is not configured for this category.' });
    }

    // 1. Apply coupon if any
    let discountApplied = 0;
    let couponModel = null;
    if (couponCode) {
      couponModel = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (couponModel && (!couponModel.expiryDate || new Date(couponModel.expiryDate) > new Date())) {
        if (couponModel.discountType === 'percentage') {
          discountApplied = Math.round((totalAmount * couponModel.discountValue) / 100);
        } else if (couponModel.discountType === 'fixed') {
          discountApplied = couponModel.discountValue;
        }
        totalAmount = Math.max(0, totalAmount - discountApplied);
      }
    }

    // 2. Generate unique surprise credentials
    const uniqueId = `s-${generateRandomString(6)}`;
    const randomPassword = generateRandomString(8);

    // 3. Create actual Razorpay order
    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Razorpay payment gateway credentials are not configured on the server.' });
    }

    let orderId = '';
    const options = {
      amount: totalAmount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: uniqueId
    };
    
    const order = await razorpay.orders.create(options);
    orderId = order.id;

    // Save payment reference
    const paymentRef = new Payment({
      razorpayOrderId: orderId,
      instanceId: uniqueId,
      amount: totalAmount,
      status: 'created',
      customerName,
      customerEmail,
      customerPhone,
      categoryId: category._id,
      demoId: demo ? demo._id : null,
      tier: selectedTier,
      generatedPassword: randomPassword
    });
    await paymentRef.save();

    // Return order details
    res.json({
      success: true,
      orderId,
      amount: totalAmount,
      currency: 'INR',
      keyId: KEY_ID,
      checkoutDetails: {
        instanceId: uniqueId,
        password: randomPassword, // Send password to frontend to store/verify after successful checkout
        categoryName: category.name,
        categoryId: category._id,
        demoId: demo ? demo._id : null,
        tierName: selectedTier,
        addonsSelected: [], // Completely removed add-ons
        customerName,
        customerEmail,
        customerPhone,
        pricePaid: totalAmount
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating checkout order.' });
  }
};

// Verify payment and instantiate the surprise mini-site
exports.verifyPayment = async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  } = req.body;

  if (!razorpayOrderId) {
    return res.status(400).json({ success: false, message: 'Required transaction details missing.' });
  }

  try {
    // 1. Retrieve the secure Payment record from database
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Transaction order record not found.' });
    }

    const {
      instanceId,
      generatedPassword: password,
      categoryId,
      demoId,
      tier: tierName,
      customerName,
      customerEmail,
      customerPhone,
      amount: pricePaid
    } = payment;
    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }

    // 1. Signature Verification
    const text = razorpayOrderId + '|' + razorpayPaymentId;
    const generated_signature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }

    // Update payment model
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: 'captured' }
    );

    // 2. Check if instance already exists (idempotency)
    const existing = await SurpriseInstance.findOne({ instanceId });
    if (existing) {
      return res.json({
        success: true,
        message: 'Payment verified, instance already created.',
        instanceId,
        password
      });
    }

    // 3. Create the Surprise Instance in the database
    const newInstance = new SurpriseInstance({
      instanceId,
      password, // Password will be hashed by pre-save hook
      category: categoryId,
      demo: demoId,
      tier: tierName || 'Basic',
      status: 'Paid',
      customerName,
      customerEmail,
      customerPhone,
      pricePaid,
      addonsSelected: [],
      config: {
        recipientName: 'My Special Someone',
        senderName: customerName || 'With Love',
        specialDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default 15 days from now
        message: `Aap mere liye bohot khaas ho. Happy Surprise!`,
        themeColor: '#E11D48',
        photos: [],
        songChoice: 'romantic'
      }
    });

    await newInstance.save();

    // Log Analytics Events for Payment Completed & Surprise Created
    try {
      const AnalyticsEvent = require('../models/AnalyticsEvent');
      const categoryObj = await SurpriseCategory.findById(categoryId);
      const categorySlug = categoryObj ? categoryObj.slug : '';
      let themeSlug = 'custom';
      if (demoId) {
        const dObj = await Demo.findById(demoId);
        if (dObj) themeSlug = dObj.themeSlug;
      }

      const commonPayload = {
        categorySlug,
        themeSlug,
        tier: tierName || 'Basic',
        price: pricePaid || 0,
        instanceId,
        sessionId: 'backend_payment_verify',
        metadata: { razorpayOrderId, razorpayPaymentId }
      };

      await new AnalyticsEvent({ eventName: 'Payment completed', ...commonPayload }).save();
      await new AnalyticsEvent({ eventName: 'Surprise created', ...commonPayload }).save();
      console.log(`[Analytics] Tracked Payment completed & Surprise created for instance ${instanceId}`);
    } catch (trackErr) {
      console.error('Failed to log payment analytics events:', trackErr);
    }

    // 4. Send Emails and determine credentials display for Wedding Invitation
    // 4. Send Emails and determine credentials display for Wedding Invitation
    const categoryObj = await SurpriseCategory.findById(categoryId);
    const categorySlug = categoryObj ? categoryObj.slug : '';
    const finalCategoryName = categoryObj ? categoryObj.name : 'Pyaar Ke Pal';

    try {
      if (categorySlug === 'wedding-invitation') {
        let demoName = 'Wedding Theme';
        if (demoId) {
          const dObj = await Demo.findById(demoId);
          if (dObj) demoName = dObj.name;
        }
        await emailService.sendWeddingOrderEmails({
          customerName,
          customerEmail,
          customerPhone,
          tierName: tierName || 'Basic',
          demoName,
          instanceId,
          pricePaid
        });
      } else {
        // Send real email with credentials for standard surprise purchases
        await emailService.sendSurpriseCredentialsEmail({
          customerName,
          customerEmail,
          instanceId,
          password,
          categoryName: finalCategoryName,
          pricePaid
        });
      }
    } catch (emailErr) {
      console.error('❌ SMTP Email sending failed but checkout was successful:', emailErr);
    }

    // 5. Simulate sending Email to customer
    console.log('\n' + '='.repeat(60));
    console.log(`✉️  EMAIL SENT TO: ${customerEmail}`);
    console.log(`SUBJECT: Pyaar Ke Pal — Aapka Surprise Customize Karne Ke Liye Taiyar Hai!`);
    console.log(`Dear ${customerName || 'Customer'},`);
    console.log(`Thank you for purchasing your Surprise: ${finalCategoryName}.`);
    console.log(`Here are your credentials to log in and customize your Surprise:`);
    console.log(`------------------------------------------------------------`);
    console.log(`Access Link:         /s/${instanceId}`);
    console.log(`Customization Login: /login`);
    console.log(`Username / ID:       ${instanceId}`);
    console.log(`Password:            ${password}`);
    console.log(`------------------------------------------------------------`);
    console.log(`Log in to upload photos, write messages, choose theme music,`);
    console.log(`and preview the live surprise!`);
    console.log('='.repeat(60) + '\n');

    res.json({
      success: true,
      message: 'Payment verified and credentials generated successfully.',
      instanceId,
      password,
      noCredentials: categorySlug === 'wedding-invitation'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error processing payment verification.' });
  }
};
