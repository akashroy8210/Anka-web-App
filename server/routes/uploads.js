const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const isCloudinaryConfigured = !!(CLOUD_NAME && API_KEY && API_SECRET);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
  });
  console.log('Cloudinary initialized for file uploads.');
}

// Ensure uploads folder exists for temporary multer storage
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|mp3|wav|m4a|ogg/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('audio/');
  if (ext && mime) {
    return cb(null, true);
  }
  cb(new Error('Only image files and audio files (mp3, wav, m4a, ogg) are allowed.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/upload - Handle file upload exclusively via Cloudinary
router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error.'
      });
    }
    next();
  });
}, async (req, res) => {
  if (!isCloudinaryConfigured) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Cloudinary configuration is missing. Upload cannot be processed.' 
    });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  try {
    // Upload local temp file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'anka_surprises',
      resource_type: 'auto'
    });
    
    // Delete temporary local file immediately
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id
    });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    // Cleanup local file if it exists and Cloudinary failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'Error uploading file to Cloudinary.' 
    });
  }
});

module.exports = router;
