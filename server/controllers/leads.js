const OnDemandLead = require('../models/OnDemandLead');

// Public: Submit a custom surprise idea request
exports.createLead = async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Aapka naam, phone aur surprise ka idea zaroori hain!' });
  }

  try {
    const newLead = new OnDemandLead({
      name,
      phone,
      message
    });

    await newLead.save();
    res.status(201).json({ success: true, message: 'Aapka message mil gaya hai! Hum jald hi WhatsApp ya call par contact karenge.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error submitting lead request.' });
  }
};

// Admin: Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await OnDemandLead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error retrieving leads.' });
  }
};

// Admin: Update lead status
exports.updateLeadStatus = async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  try {
    const lead = await OnDemandLead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating lead status.' });
  }
};

// Admin: Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await OnDemandLead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting lead.' });
  }
};
