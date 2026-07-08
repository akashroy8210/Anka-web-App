const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'anka_secret_key_12345';

// Verify Super Admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access forbidden. Not an admin.' });
    }
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

module.exports = {
  verifyAdmin,
  verifyCustomerInstance,
  JWT_SECRET
};
