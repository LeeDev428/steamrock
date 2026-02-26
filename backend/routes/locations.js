const express = require('express');
const router = express.Router();
const PropertyLocation = require('../models/PropertyLocation');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/locations
// @desc    Get all locations
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const locations = await PropertyLocation.find().sort({ province: 1, city: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/locations/:id
// @desc    Get single location
// @access  Private/Admin
router.get('/:id', protect, async (req, res) => {
  try {
    const location = await PropertyLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/locations
// @desc    Create location
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const location = new PropertyLocation(req.body);
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/locations/:id
// @desc    Update location
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const location = await PropertyLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/locations/:id
// @desc    Delete location
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const location = await PropertyLocation.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
