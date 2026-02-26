const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect, adminOnly } = require('../middleware/auth');

// Default settings
const defaultSettings = {
  key: 'main',
  siteName: 'Streamrock Realty',
  tagline: 'Your Trusted Real Estate Partner',
  hero: {
    type: 'carousel',
    items: []
  },
  navLinks: [
    { name: 'Home', path: '/', order: 0 },
    { name: 'About Us', path: '/about', order: 1 },
    { 
      name: 'Projects', 
      path: '/projects', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Parks', path: '/projects/parks' },
        { name: 'BeachTowns', path: '/projects/beachtowns' },
        { name: 'Shores', path: '/projects/shores' },
        { name: 'Peaks', path: '/projects/peaks' }
      ],
      order: 2 
    },
    { name: 'Contact Us', path: '/contact', order: 3 }
  ],
  featureIcons: [
    { icon: 'waves', title: 'SEASIDE RESIDENTIAL COMMUNITIES', order: 0 },
    { icon: 'palm', title: 'LEISURE TOURISM ESTATES', order: 1 },
    { icon: 'building', title: 'WORLD-CLASS HOTELS AND SERVICED CONDOMINIUMS', order: 2 },
    { icon: 'umbrella', title: 'THEMED RESORT AMENITIES', order: 3 }
  ],
  contact: {
    phone: '+63 912 345 6789',
    email: 'info@streamrockrealty.com',
    address: 'Manila, Philippines'
  },
  footer: {
    copyright: '© 2026 Streamrock Realty. All rights reserved.'
  }
};

// @route   GET /api/settings
// @desc    Get site settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'main' });
    
    // If no settings exist, create default
    if (!settings) {
      settings = await SiteSettings.create(defaultSettings);
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update site settings
// @access  Private/Admin
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'main' });
    
    if (!settings) {
      settings = new SiteSettings({ ...defaultSettings, ...req.body });
    } else {
      Object.assign(settings, req.body);
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/settings/hero
// @desc    Update hero section
// @access  Private/Admin
router.put('/hero', protect, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { hero: req.body },
      { new: true, upsert: true }
    );
    res.json(settings.hero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/settings/nav
// @desc    Update navigation
// @access  Private/Admin
router.put('/nav', protect, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { navLinks: req.body },
      { new: true, upsert: true }
    );
    res.json(settings.navLinks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/settings/features
// @desc    Update feature icons
// @access  Private/Admin
router.put('/features', protect, adminOnly, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { featureIcons: req.body },
      { new: true, upsert: true }
    );
    res.json(settings.featureIcons);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
