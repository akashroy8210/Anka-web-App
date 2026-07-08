const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SurpriseInstance = require('../models/SurpriseInstance');
const { JWT_SECRET } = require('../middleware/auth');

// Super Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: 'admin', username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: 'admin' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

// Customer Instance Login
exports.customerLogin = async (req, res) => {
  const { instanceId, password } = req.body;

  if (!instanceId || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields.' });
  }

  try {
    const instance = await SurpriseInstance.findOne({ instanceId }).populate('category');
    if (!instance) {
      return res.status(400).json({ success: false, message: 'Invalid instance ID or password.' });
    }

    const isMatch = await instance.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid instance ID or password.' });
    }

    const token = jwt.sign(
      { instanceId: instance.instanceId, role: 'customer', email: instance.customerEmail },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      instance: {
        instanceId: instance.instanceId,
        category: instance.category.name,
        tier: instance.tier,
        status: instance.status,
        customerName: instance.customerName,
        customerEmail: instance.customerEmail,
        config: instance.config
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during customer login.' });
  }
};
