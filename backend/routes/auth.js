const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { generateToken, protect } = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register admin (protected - only superadmin can create new admins)
// @access  Private/Superadmin
router.post('/register', protect, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only superadmin can create new admins
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to create admin accounts' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin'
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/setup
// @desc    Initial setup - create first superadmin (only works if no admins exist)
// @access  Public (only works once)
router.post('/setup', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Setup already completed' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: 'superadmin'
    });

    res.status(201).json({
      message: 'Initial setup complete',
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.admin);
});

// @route   PUT /api/auth/password
// @desc    Update password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin._id).select('+password');
    
    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
