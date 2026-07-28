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

// Customer Account Registration (Email + Password)
exports.customerAccountRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    const newUser = new User({
      username: `user_${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name ? name.trim() : '',
      password,
      role: 'customer'
    });

    await newUser.save();

    // Auto-link all existing SurpriseInstance documents matching this email
    await SurpriseInstance.updateMany(
      { customerEmail: { $regex: new RegExp(`^${email.trim()}$`, 'i') } },
      { $set: { ownerUser: newUser._id } }
    );

    const token = jwt.sign(
      { id: newUser._id, role: 'customer', email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Customer registration error:', err);
    res.status(500).json({ success: false, message: 'Server error creating customer account.' });
  }
};

// Customer Account Login (Email + Password)
exports.customerAccountLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'customer' });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    // Auto-link any unlinked surprises
    await SurpriseInstance.updateMany(
      { customerEmail: { $regex: new RegExp(`^${email.trim()}$`, 'i') }, ownerUser: { $exists: false } },
      { $set: { ownerUser: user._id } }
    );

    const token = jwt.sign(
      { id: user._id, role: 'customer', email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Customer account login error:', err);
    res.status(500).json({ success: false, message: 'Server error logging into customer account.' });
  }
};

// Customer Google Authentication
exports.customerGoogleAuth = async (req, res) => {
  const { email, name, googleToken } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required for Google login.' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      user = new User({
        username: `google_${Date.now()}`,
        email: email.toLowerCase().trim(),
        name: name || 'Google User',
        role: 'customer'
      });
      await user.save();
    }

    // Auto-link any unlinked surprises matching this email
    await SurpriseInstance.updateMany(
      { customerEmail: { $regex: new RegExp(`^${email.trim()}$`, 'i') }, ownerUser: { $exists: false } },
      { $set: { ownerUser: user._id } }
    );

    const token = jwt.sign(
      { id: user._id, role: 'customer', email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, message: 'Server error processing Google authentication.' });
  }
};

// Customer Password / Credentials Recovery by Email
exports.recoverCustomerPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  try {
    const instances = await SurpriseInstance.find({
      customerEmail: { $regex: new RegExp(`^${email.trim()}$`, 'i') }
    }).populate('category');

    if (!instances || instances.length === 0) {
      return res.status(404).json({ success: false, message: 'No surprise instances found for this email address.' });
    }

    const emailQueueWorker = require('../services/emailQueue');
    for (const inst of instances) {
      emailQueueWorker.enqueueCredentialsEmail({
        customerName: inst.customerName,
        customerEmail: inst.customerEmail,
        instanceId: inst.instanceId,
        password: '(Log in via Customer Portal)',
        categoryName: inst.category ? inst.category.name : 'Pyaar Ke Pal Surprise',
        pricePaid: inst.pricePaid
      });
    }

    res.json({
      success: true,
      message: `Recovery details dispatched to ${email}. Check your inbox shortly.`
    });
  } catch (err) {
    console.error('Password recovery error:', err);
    res.status(500).json({ success: false, message: 'Server error processing password recovery.' });
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
