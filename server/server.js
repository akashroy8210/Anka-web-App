const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const instanceRoutes = require('./routes/instances');
const leadRoutes = require('./routes/leads');
const templateRoutes = require('./routes/templates');
const couponRoutes = require('./routes/coupons');
const paymentRoutes = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');
const ratingRoutes = require('./routes/ratings');
const demoRoutes = require('./routes/demos');
const uploadRoutes = require('./routes/uploads');
const faqRoutes = require('./routes/faqs');
const path = require('path');

const app = express();

// Enable CORS immediately as top-level middleware
app.use(cors());

// Trust proxy for fetching client IP behind reverse proxy (Render, Vercel, Heroku)
app.set('trust proxy', 1);

// Global API rate-limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Tight rate-limiter for authentication / checkout attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit each IP to 30 authentication/checkout attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

// Enforce HTTPS in production (except on localhost)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const host = req.headers.host || '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return next();
    }
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach io to express app so that controller routes can access it
app.set('io', io);

// Socket.IO Connection and event registration
io.on('connection', (socket) => {
  console.log('Client connected to socket:', socket.id);

  socket.on('join-room', (instanceId) => {
    socket.join(instanceId);
    console.log(`Socket ${socket.id} joined room: ${instanceId}`);

    const clients = io.sockets.adapter.rooms.get(instanceId);
    const activeUsersCount = clients ? clients.size : 0;
    io.to(instanceId).emit('status_update', {
      activeUsersCount,
      lastEvent: 'User Connected'
    });
  });

  socket.on('admin-action', ({ instanceId, action, data }) => {
    console.log(`Admin action in room ${instanceId}: ${action}`, data);
    socket.to(instanceId).emit('live-trigger', { action, data });
  });

  socket.on('trigger_event', ({ event, payload }) => {
    const roomId = socket.handshake.query.roomId || 'default';
    console.log(`Trigger event in room ${roomId}: ${event}`, payload);
    socket.to(roomId).emit('magical_event', { event, payload });

    let ankaAction = null;
    if (event === "heart_rain") ankaAction = "confetti";
    if (event === "special_finale") ankaAction = "fireworks";
    if (event === "shooting_star") ankaAction = "popup";
    if (ankaAction) {
      socket.to(roomId).emit('live-trigger', { action: ankaAction, data: payload });
    }

    const clients = io.sockets.adapter.rooms.get(roomId);
    const activeUsersCount = clients ? clients.size : 0;
    io.to(roomId).emit('status_update', {
      activeUsersCount,
      lastEvent: event
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from socket:', socket.id);
  });
});

// Middleware
app.use(express.json());

// Apply rate limiter globally to all API routes
app.use('/api', apiLimiter);

// Apply strict rate-limiter on authentication and payment endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/payments/checkout', authLimiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/instances', instanceRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/demos', demoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/ai', require('./ai/routes/ai.routes'));

// Route: Valentines voice recording base64 upload to Cloudinary
app.post('/api/admin/upload-voice', async (req, res) => {
  const { audioData } = req.body;
  if (!audioData) {
    return res.status(400).json({ success: false, error: 'No audio data provided' });
  }

  try {
    const cloudinary = require('cloudinary').v2;
    const result = await cloudinary.uploader.upload(audioData, {
      folder: 'anka_surprises_voice',
      resource_type: 'video'
    });

    return res.json({
      success: true,
      audioUrl: result.secure_url
    });
  } catch (err) {
    console.error('Voice note upload error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Error uploading voice note.' });
  }
});

// Serve frontend static build in production if built
const clientBuildPath = path.join(__dirname, '../client/dist');
if (require('fs').existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  // Place wildcard fallback route after API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AnKa Backend API is running smoothly.' });
});

// Global unhandled error boundary middleware to prevent leaking stack traces
app.use((err, req, res, next) => {
  console.error('Unhandled server exception caught:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on our server. Please try again later.'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Database and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    const appServer = server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    appServer.timeout = 300000; // 5 minutes timeout for uploads
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB. Server not started.', err.message);
    console.log('\nRunning in Fallback Mock Database mode for development...');
    // We can run the server anyway to allow mock checkouts without crashing
    const appServer = server.listen(PORT, () => {
      console.log(`Server running in fallback mode on port ${PORT} (Database not connected)`);
    });
    appServer.timeout = 300000; // 5 minutes timeout for uploads
  });
