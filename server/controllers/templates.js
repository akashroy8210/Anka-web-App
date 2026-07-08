const WebsiteTemplate = require('../models/WebsiteTemplate');

// Public: Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await WebsiteTemplate.find();
    res.json({ success: true, templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching templates.' });
  }
};

// Admin: Create a website template
exports.createTemplate = async (req, res) => {
  const { name, category, description, liveDemoUrl, imageUrl, pricingTiers } = req.body;

  if (!name || !category) {
    return res.status(400).json({ success: false, message: 'Name and category are required.' });
  }

  try {
    const newTemplate = new WebsiteTemplate({
      name,
      category,
      description,
      liveDemoUrl,
      imageUrl,
      pricingTiers: pricingTiers || []
    });

    await newTemplate.save();
    res.status(201).json({ success: true, template: newTemplate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating template.' });
  }
};

// Admin: Update a website template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await WebsiteTemplate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }

    res.json({ success: true, template });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating template.' });
  }
};

// Admin: Delete a website template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await WebsiteTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }
    res.json({ success: true, message: 'Website template deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting template.' });
  }
};
