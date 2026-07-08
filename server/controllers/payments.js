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

    let totalAmount = 99;
    let selectedTier = tierName || 'Basic';

    const categoryTier = category.tiers?.find(t => t.name === selectedTier);
    if (categoryTier && typeof categoryTier.price === 'number') {
      totalAmount = categoryTier.price;
    } else {
      if (category.slug === 'wedding-invitation') {
        if (selectedTier === 'Basic') {
          totalAmount = 1499;
        } else {
          totalAmount = demo ? demo.price : 2500;
        }
      } else {
        if (selectedTier === 'Basic') {
          totalAmount = 299;
        } else {
          totalAmount = demo ? demo.price : 999;
        }
      }
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

    // 3. Create Razorpay order (or mock)
    let orderId = '';
    const isMock = !razorpay;

    if (!isMock) {
      // Create actual Razorpay order
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
        status: 'created'
      });
      await paymentRef.save();
    } else {
      // Mock order
      orderId = `order_mock_${generateRandomString(12)}`;
      
      // Save payment reference
      const paymentRef = new Payment({
        razorpayOrderId: orderId,
        instanceId: uniqueId,
        amount: totalAmount,
        status: 'created'
      });
      await paymentRef.save();
    }

    // Return order details, along with pre-calculated details for mockup checkout screen
    res.json({
      success: true,
      isMock,
      orderId,
      amount: totalAmount,
      currency: 'INR',
      keyId: KEY_ID || 'rzp_test_mockkey12345',
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
    razorpaySignature,
    checkoutDetails
  } = req.body;

  if (!razorpayOrderId || !checkoutDetails) {
    return res.status(400).json({ success: false, message: 'Required transaction details missing.' });
  }

  const {
    instanceId,
    password,
    categoryId,
    categoryName,
    demoId,
    tierName,
    customerName,
    customerEmail,
    customerPhone,
    pricePaid
  } = checkoutDetails;

  try {
    const isMock = !razorpay || razorpayOrderId.startsWith('order_mock_');

    // 1. Signature Verification
    if (!isMock) {
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
    } else {
      // Mock update
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId: `pay_mock_${generateRandomString(12)}`, status: 'captured' }
      );
    }

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

    // 4. Send Emails and determine credentials display for Wedding Invitation
    try {
      const categoryObj = await SurpriseCategory.findById(categoryId);
      const categorySlug = categoryObj ? categoryObj.slug : '';

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
          categoryName: categoryName || (categoryObj ? categoryObj.name : 'Surprise'),
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
    console.log(`Thank you for purchasing your Surprise: ${categoryName || 'Pyaar Ke Pal'}.`);
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
