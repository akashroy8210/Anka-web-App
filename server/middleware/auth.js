const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'anka_secret_key_12345';

const AdminSession = require('../models/AdminSession');

// Verify Super Admin token
const verifyAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access forbidden. Not an admin.' });
    }

    // Check if session exists in DB
    const activeSession = await AdminSession.findOne({ token });
    if (!activeSession) {
      return res.status(401).json({ success: false, message: 'Session expired or logged out from another device.' });
    }

    // Update last active time in background
    activeSession.lastActiveTime = new Date();
    activeSession.save().catch(e => console.error('Failed to save session active update', e));

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Verify Customer Instance token
const verifyCustomerInstance = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const targetInstanceId = req.params.instanceId || req.body.instanceId;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the token is super-admin OR if it is the customer matching the target instance ID
    if (decoded.role === 'admin') {
      req.user = decoded;
      return next(); // Admins can impersonate/view for support
    }

    if (decoded.instanceId !== targetInstanceId) {
      return res.status(403).json({ success: false, message: 'Access forbidden. Unauthorized for this instance.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Verify if request is made by EITHER a super admin OR any customer instance
const verifyAnyUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains role: 'admin' or instanceId
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = {
  verifyAdmin,
  verifyCustomerInstance,
  verifyAnyUser,
  JWT_SECRET
};
