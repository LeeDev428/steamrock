const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');
const MediaFile = require('../models/MediaFile');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || 'general';
    const dir = path.join(uploadsDir, type);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images and videos are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// @route   GET /api/upload
// @desc    List all uploaded files
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const files = await MediaFile.find(filter).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/upload
// @desc    Upload single file
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const type = req.query.type || 'general';
    const fileUrl = `/uploads/${type}/${req.file.filename}`;

    const mediaFile = await MediaFile.create({
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type,
      uploadedBy: req.admin._id
    });

    res.json({
      message: 'File uploaded successfully',
      _id: mediaFile._id,
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private/Admin
router.post('/multiple', protect, adminOnly, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const type = req.query.type || 'general';
    const files = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/${type}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/upload
// @desc    Delete file
// @access  Private/Admin
router.delete('/', protect, adminOnly, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'File URL is required' });
    }

    const filePath = path.join(__dirname, '..', url);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      await MediaFile.findOneAndDelete({ url });
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
