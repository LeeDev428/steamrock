const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/blogs
// @desc    Get all blogs (public - only published, admin - all)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, search, limit } = req.query;
    let filter = {};
    
    // For public access, only show published blogs
    if (!req.headers.authorization) {
      filter.status = 'Published';
    } else if (status) {
      filter.status = status;
    }
    
    if (category) filter.category = category;
    
    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    let query = Blog.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const blogs = await query;
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/blogs/categories
// @desc    Get blog categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(categories.map(c => ({ name: c._id, count: c.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/blogs/recent
// @desc    Get recent blogs
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Published' })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug or _id
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const query = mongoose.Types.ObjectId.isValid(req.params.slug)
      ? { _id: req.params.slug }
      : { slug: req.params.slug };

    const blog = await Blog.findOne(query)
      .populate('author', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if blog is published (for public access)
    if (!req.headers.authorization && blog.status !== 'Published') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.admin._id
    });
    
    const savedBlog = await blog.save();
    const populatedBlog = await Blog.findById(savedBlog._id).populate('author', 'name');
    
    res.status(201).json(populatedBlog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this title already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this title already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
