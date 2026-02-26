const express = require('express');
const router = express.Router();
const Contractor = require('../models/Contractor');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/contractors
// @desc    Get all contractors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const contractors = await Contractor.find({ isActive: true }).sort({ name: 1 });
    res.json(contractors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/contractors/:id
// @desc    Get single contractor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.json(contractor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/contractors
// @desc    Create contractor
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const contractor = new Contractor(req.body);
    const newContractor = await contractor.save();
    res.status(201).json(newContractor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/contractors/:id
// @desc    Update contractor
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.json(contractor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/contractors/:id
// @desc    Delete contractor (soft delete)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.json({ message: 'Contractor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
