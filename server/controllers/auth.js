const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SurpriseInstance = require('../models/SurpriseInstance');
const { JWT_SECRET } = require('../middleware/auth');

const AdminSession = require('../models/AdminSession');

// Super Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password, deviceId, deviceType, browser, os, forceLogoutDeviceId } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter all fields.' });
  }

  const cleanDeviceId = deviceId || 'default-admin-device';
  const cleanDeviceType = (deviceType === 'mobile' || deviceType === 'desktop') ? deviceType : 'desktop';

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // 1. Force logout request from client
    if (forceLogoutDeviceId) {
      await AdminSession.deleteMany({ userId: user._id, deviceId: forceLogoutDeviceId });
    }

    // 2. Query other active sessions
    const activeSessions = await AdminSession.find({ userId: user._id });

    // Check conflict: maximum 1 laptop/desktop and 1 mobile device
    const conflictingSession = activeSessions.find(s => s.deviceType === cleanDeviceType && s.deviceId !== cleanDeviceId);
    
    if (conflictingSession) {
      return res.status(409).json({
        success: false,
        limitReached: true,
        message: 'You have reached the maximum number of active devices.',
        deviceType: cleanDeviceType,
        activeSessions: activeSessions.map(s => ({
          id: s._id,
          deviceId: s.deviceId,
          deviceType: s.deviceType,
          browser: s.browser,
          os: s.os,
          ip: s.ip,
          lastActiveTime: s.lastActiveTime,
          lastLogin: s.lastLogin
        }))
      });
    }

    const token = jwt.sign(
      { id: user._id, role: 'admin', username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove any outdated session entries for this specific device to prevent duplicates
    await AdminSession.deleteMany({ userId: user._id, deviceId: cleanDeviceId });

    // Record new active session
    const session = new AdminSession({
      userId: user._id,
      deviceId: cleanDeviceId,
      deviceType: cleanDeviceType,
      browser: browser || 'Unknown Browser',
      os: os || 'Unknown OS',
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      token
    });
    await session.save();

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

// GET /api/auth/admin/sessions (Admin only)
exports.getAdminSessions = async (req, res) => {
  try {
    const sessions = await AdminSession.find({ userId: req.user.id }).sort({ lastActiveTime: -1 });
    res.json({
      success: true,
      sessions: sessions.map(s => ({
        id: s._id,
        deviceId: s.deviceId,
        deviceType: s.deviceType,
        browser: s.browser,
        os: s.os,
        ip: s.ip,
        lastActiveTime: s.lastActiveTime,
        lastLogin: s.lastLogin,
        isCurrent: s.token === (req.headers['authorization']?.split(' ')[1])
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error retrieving active sessions.' });
  }
};

// DELETE /api/auth/admin/sessions/:id (Admin only)
exports.revokeAdminSession = async (req, res) => {
  try {
    const session = await AdminSession.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Active session not found.' });
    }

    await session.deleteOne();
    res.json({ success: true, message: 'Session terminated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error terminating active session.' });
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

// Admin Change Password (Admin only)
exports.adminChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user?.id; // Set by verifyAdmin middleware

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please enter all fields.' });
  }

  try {
    const user = await User.findById(adminId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Assign new password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
};
