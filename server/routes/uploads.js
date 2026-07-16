const express = require('express');
const router = require('express').Router();
const { verifyAnyUser } = require('../middleware/auth');
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
  const isImageMime = file.mimetype.startsWith('image/');
  const isAudioMime = file.mimetype.startsWith('audio/');
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isImageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
  const isAudioExt = ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.mp4'].includes(ext);

  if (isImageMime || isAudioMime || isImageExt || isAudioExt) {
    return cb(null, true);
  }
  
  const errMessage = `File type rejected: extension "${ext}" and mimetype "${file.mimetype}" are not recognized as supported image or audio formats.`;
  console.error(errMessage);
  cb(new Error(errMessage));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// POST /api/upload - Handle file upload exclusively via Cloudinary (requires valid authentication token)
router.post('/', verifyAnyUser, (req, res, next) => {
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

// POST /api/upload/delete - Delete file from Cloudinary (requires valid authentication token)
router.post('/delete', verifyAnyUser, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, message: 'publicId is required.' });
  }

  if (!isCloudinaryConfigured) {
    return res.status(500).json({ 
      success: false, 
      message: 'Cloudinary configuration is missing.' 
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return res.json({
      success: true,
      result
    });
  } catch (err) {
    console.error('Cloudinary Destroy Error:', err);
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'Error deleting file from Cloudinary.' 
    });
  }
});

module.exports = router;
