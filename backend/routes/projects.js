const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');
const { normalizeProjectPayload } = require('../utils/projectContent');

// @route   GET /api/projects
// @desc    Get all projects (public - with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, featured, contractor } = req.query;
    let filter = {};
    
    // For public access, only show published projects
    if (!req.headers.authorization) {
      filter.status = 'Published';
    } else if (status) {
      filter.status = status;
    }
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (contractor) filter.contractor = contractor;

    const projects = await Project.find(filter)
      .populate('contractor', 'name logo')
      .populate('location', 'barangay city province')
      .sort({ order: 1, createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/projects/categories
// @desc    Get project categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Project.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(categories.map(c => ({ name: c._id, count: c.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/projects/:slug
// @desc    Get single project by slug or _id
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const query = mongoose.Types.ObjectId.isValid(req.params.slug)
      ? { _id: req.params.slug }
      : { slug: req.params.slug };

    const project = await Project.findOne(query)
      .populate('contractor', 'name logo description website')
      .populate('location');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project is published (for public access)
    if (!req.headers.authorization && project.status !== 'Published') {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create project
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const project = new Project(normalizeProjectPayload(req.body));
    const newProject = await project.save();
    
    const populatedProject = await Project.findById(newProject._id)
      .populate('contractor', 'name logo')
      .populate('location');
    
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/projects/bulk-status
// @desc    Update status for multiple projects
// @access  Private/Admin
router.put('/bulk-status', protect, adminOnly, async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Project IDs are required' });
    }

    if (!['Draft', 'Published', 'Archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const result = await Project.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    res.json({
      message: 'Project statuses updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/projects/bulk
// @desc    Delete multiple projects
// @access  Private/Admin
router.delete('/bulk', protect, adminOnly, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Project IDs are required' });
    }

    const result = await Project.deleteMany({ _id: { $in: ids } });

    res.json({
      message: 'Projects deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, normalizeProjectPayload(req.body));
    await project.save();
    await project.populate('contractor', 'name logo');
    await project.populate('location');

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/projects/:id/status
// @desc    Update project status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
