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

// Ensure uploads folders exist for temporary multer storage
const adminUploadDir = path.join(__dirname, '../uploads/admin');
const clientUploadDir = path.join(__dirname, '../uploads/client');

if (!fs.existsSync(adminUploadDir)) {
  fs.mkdirSync(adminUploadDir, { recursive: true });
}
if (!fs.existsSync(clientUploadDir)) {
  fs.mkdirSync(clientUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAdmin = req.user && req.user.role === 'admin';
    const destDir = isAdmin ? adminUploadDir : clientUploadDir;
    // Double check existence in case folder gets deleted
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const isImageMime = file.mimetype.startsWith('image/');
  const isAudioMime = file.mimetype.startsWith('audio/');
  const isVideoMime = file.mimetype.startsWith('video/');
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isImageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
  const isAudioExt = ['.mp3', '.wav', '.m4a', '.ogg', '.aac'].includes(ext);
  const isVideoExt = ['.mp4', '.mov', '.avi', '.webm'].includes(ext);

  if (isImageMime || isAudioMime || isVideoMime || isImageExt || isAudioExt || isVideoExt) {
    return cb(null, true);
  }
  
  const errMessage = `File type rejected: extension "${ext}" and mimetype "${file.mimetype}" are not recognized as supported image, audio, or video formats.`;
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

  // Size limit validation (10MB for image/audio, 50MB for video)
  const isVideo = req.file.mimetype.startsWith('video/');
  const maxAllowedSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (req.file.size > maxAllowedSize) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({
      success: false,
      message: `File size too large. Maximum limit is ${isVideo ? '50MB for videos' : '10MB for images/audio'}.`
    });
  }

  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const uploadOptions = {
      folder: isAdmin ? 'anka_admin' : 'anka_client',
      resource_type: 'auto'
    };

    // Apply auto-compression & transcoding parameters based on file type
    if (req.file.mimetype.startsWith('image/')) {
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
    } else if (isVideo) {
      uploadOptions.resource_type = 'video';
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
    }

    // Upload local temp file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
    
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
