const SurpriseInstance = require('../models/SurpriseInstance');
const crypto = require('crypto');

// Public view for live surprise site (removes sensitive user credentials)
exports.getLiveInstance = async (req, res) => {
  try {
    const instance = await SurpriseInstance.findOne({ instanceId: req.params.instanceId })
      .populate('category', 'name slug');

    if (!instance) {
      return res.status(404).json({ success: false, message: 'Surprise site not found.' });
    }

    // Return only configuration data for the recipient to view
    const safeData = {
      instanceId: instance.instanceId,
      category: instance.category,
      tier: instance.tier,
      status: instance.status,
      config: instance.config,
      recipientResponse: instance.recipientResponse || '',
      feedbackLiked: instance.feedbackLiked,
      createdAt: instance.createdAt
    };

    res.json({ success: true, instance: safeData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error retrieving live surprise page.' });
  }
};

// Customer/Admin: Get instance details
exports.getInstanceDetails = async (req, res) => {
  try {
    const instance = await SurpriseInstance.findOne({ instanceId: req.params.instanceId })
      .populate('category');

    if (!instance) {
      return res.status(404).json({ success: false, message: 'Instance not found.' });
    }

    res.json({
      success: true,
      instance: {
        instanceId: instance.instanceId,
        category: instance.category.name,
        categorySlug: instance.category.slug,
        categoryId: instance.category._id,
        tier: instance.tier,
        status: instance.status,
        customerName: instance.customerName,
        customerEmail: instance.customerEmail,
        customerPhone: instance.customerPhone,
        pricePaid: instance.pricePaid,
        addonsSelected: instance.addonsSelected,
        config: instance.config,
        recipientResponse: instance.recipientResponse || '',
        proposalStatus: instance.proposalStatus || 'Pending',
        proposalAcceptanceTime: instance.proposalAcceptanceTime,
        feedbackLiked: instance.feedbackLiked,
        createdAt: instance.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching instance details.' });
  }
};

// Recipient: Submit response feedback
exports.submitRecipientResponse = async (req, res) => {
  const { recipientResponse, feedbackLiked, proposalStatus, proposalAcceptanceTime } = req.body;
  try {
    const instance = await SurpriseInstance.findOne({ instanceId: req.params.instanceId });
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Surprise site not found.' });
    }

    if (recipientResponse !== undefined) {
      instance.recipientResponse = recipientResponse;
    }
    if (feedbackLiked !== undefined) {
      instance.feedbackLiked = feedbackLiked;
    }
    if (proposalStatus !== undefined) {
      instance.proposalStatus = proposalStatus;
    }
    if (proposalAcceptanceTime !== undefined) {
      instance.proposalAcceptanceTime = proposalAcceptanceTime;
    }

    await instance.save();

    // Emit event in real time to the instance room so that client control panel receives it
    const io = req.app.get('io');
    if (io) {
      console.log(`Emitting recipient-message for room ${req.params.instanceId}:`, {
        recipientResponse: instance.recipientResponse,
        feedbackLiked: instance.feedbackLiked,
        proposalStatus: instance.proposalStatus,
        proposalAcceptanceTime: instance.proposalAcceptanceTime
      });
      io.to(req.params.instanceId).emit('recipient-message', {
        recipientResponse: instance.recipientResponse,
        feedbackLiked: instance.feedbackLiked,
        proposalStatus: instance.proposalStatus,
        proposalAcceptanceTime: instance.proposalAcceptanceTime
      });
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully!',
      recipientResponse: instance.recipientResponse,
      feedbackLiked: instance.feedbackLiked,
      proposalStatus: instance.proposalStatus,
      proposalAcceptanceTime: instance.proposalAcceptanceTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error saving recipient feedback.' });
  }
};

// Customer/Admin: Update instance config (theme, names, date, countdown, song, messages, photos)
exports.updateInstanceConfig = async (req, res) => {
  const { config, status, customSlug } = req.body;

  try {
    const instance = await SurpriseInstance.findOne({ instanceId: req.params.instanceId });
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Instance not found.' });
    }

    // Merge config fields
    if (config) {
      instance.config = {
        ...instance.config,
        ...config
      };
      instance.markModified('config');
    }

    // If customer updates data, shift status from 'Paid' to 'Content Added' or 'Live'
    if (status) {
      instance.status = status;
    } else if (instance.status === 'Paid') {
      instance.status = 'Content Added';
    }

    // If admin/user updates the customSlug
    if (customSlug) {
      const cleanSlug = customSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-');
      if (cleanSlug !== instance.instanceId) {
        const existing = await SurpriseInstance.findOne({ instanceId: cleanSlug });
        if (existing) {
          return res.status(400).json({ success: false, message: 'Custom slug is already taken.' });
        }
        instance.instanceId = cleanSlug;
      }
    }

    await instance.save();

    // Auto-update the Demo model's liveDemoUrl if this instance is linked to a Demo
    if (instance.demo) {
      const Demo = require('../models/Demo');
      await Demo.findByIdAndUpdate(instance.demo, {
        liveDemoUrl: `/s/${instance.instanceId}`
      });
    }

    res.json({
      success: true,
      message: 'Surprise site configurations saved successfully.',
      instance: {
        instanceId: instance.instanceId,
        status: instance.status,
        config: instance.config
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating instance configs.' });
  }
};

// Admin: Get all instances
exports.getAllInstances = async (req, res) => {
  try {
    const instances = await SurpriseInstance.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, instances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error retrieving all instances.' });
  }
};

// Admin: Delete instance
exports.deleteInstance = async (req, res) => {
  try {
    const instance = await SurpriseInstance.findByIdAndDelete(req.params.id);
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Instance not found.' });
    }
    res.json({ success: true, message: 'Surprise instance deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting instance.' });
  }
};



// Admin: Submit response back to recipient
exports.submitAdminResponse = async (req, res) => {
  const { adminResponse } = req.body;
  try {
    const instance = await SurpriseInstance.findOne({ instanceId: req.params.instanceId });
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Surprise site not found.' });
    }

    instance.adminResponse = adminResponse || '';
    await instance.save();

    res.json({
      success: true,
      message: 'Admin response saved successfully!',
      adminResponse: instance.adminResponse
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error saving admin response.' });
  }
};

// Admin: Update surprise package plan tier
exports.updateInstanceTier = async (req, res) => {
  const { tier } = req.body;

  if (!tier || !['Basic', 'Premium', 'Deluxe'].includes(tier)) {
    return res.status(400).json({ success: false, message: 'Invalid tier value. Must be Basic, Premium, or Deluxe.' });
  }

  try {
    const instance = await SurpriseInstance.findById(req.params.id);
    if (!instance) {
      return res.status(404).json({ success: false, message: 'Surprise instance not found.' });
    }

    instance.tier = tier;
    await instance.save();

    res.json({
      success: true,
      message: `Surprise plan upgraded successfully to ${tier}.`,
      instance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating surprise plan.' });
  }
};

// Admin: Create pre-configured instance directly (e.g. for creating custom Demo links)
exports.adminCreateInstance = async (req, res) => {
  const {
    categoryId,
    demoId,
    tier,
    customerName,
    customerEmail,
    customerPhone,
    customSlug,
    config
  } = req.body;

  if (!categoryId) {
    return res.status(400).json({ success: false, message: 'Category ID is required.' });
  }

  try {
    // Generate unique instanceId
    let instanceId = customSlug ? customSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-') : `demo-${crypto.randomBytes(4).toString('hex')}`;
    
    // Check if custom slug is already taken
    const existing = await SurpriseInstance.findOne({ instanceId });
    if (existing) {
      if (customSlug) {
        return res.status(400).json({ success: false, message: 'Custom slug is already taken.' });
      }
      instanceId = `demo-${crypto.randomBytes(6).toString('hex')}`;
    }

    // Set default dummy password
    const password = crypto.randomBytes(8).toString('hex');

    const newInstance = new SurpriseInstance({
      instanceId,
      password, // pre-save hook will hash it
      category: categoryId,
      demo: demoId || null,
      tier: tier || 'Premium',
      status: req.body.status || 'Live', // Set status to Live immediately so it loads directly
      customerName: customerName || 'Admin Demo',
      customerEmail: customerEmail || 'admin@demo.com',
      customerPhone: customerPhone || '0000000000',
      pricePaid: 0,
      config: {
        recipientName: config?.recipientName || 'Recipient',
        senderName: config?.senderName || 'Sender',
        specialDate: config?.specialDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        message: config?.message || 'Happy Surprise! You are very special to me.',
        themeColor: config?.themeColor || '#E11D48',
        songChoice: config?.songChoice || 'romantic',
        musicUrl: config?.musicUrl || '',
        birthdaySongUrl: config?.birthdaySongUrl || '',
        photos: config?.photos || [],
        timeline: config?.timeline || [],
        memories: config?.memories || []
      }
    });

    await newInstance.save();

    // Auto-update the Demo model's liveDemoUrl to the newly generated instance path
    if (demoId) {
      const Demo = require('../models/Demo');
      await Demo.findByIdAndUpdate(demoId, {
        liveDemoUrl: `/s/${instanceId}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Demo instance created successfully!',
      instance: newInstance
    });
  } catch (err) {
    console.error('Error admin creating instance:', err);
    res.status(500).json({ success: false, message: 'Server error creating demo instance.' });
  }
};
