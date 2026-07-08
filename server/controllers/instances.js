const SurpriseInstance = require('../models/SurpriseInstance');

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
  const { recipientResponse, feedbackLiked } = req.body;
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

    await instance.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully!',
      recipientResponse: instance.recipientResponse,
      feedbackLiked: instance.feedbackLiked
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error saving recipient feedback.' });
  }
};

// Customer/Admin: Update instance config (theme, names, date, countdown, song, messages, photos)
exports.updateInstanceConfig = async (req, res) => {
  const { config, status } = req.body;

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

    await instance.save();

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
