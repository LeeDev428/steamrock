const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Parks', 'BeachTowns', 'Shores', 'Peaks']
  },
  
  // Relations
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: [true, 'Contractor is required']
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyLocation',
    required: [true, 'Location is required']
  },
  
  // Property Details
  propertyType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Mixed-Use', 'Resort', 'Farm Lot'],
    default: 'Residential'
  },
  lotSizeRange: {
    min: Number,
    max: Number,
    unit: { type: String, default: 'sqm' }
  },
  totalArea: {
    value: Number,
    unit: { type: String, default: 'Hectares' }
  },
  priceRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'PHP' }
  },
  
  // Hero Section
  hero: {
    image: { type: String },
    video: { type: String },
    title: { type: String },
    subtitle: { type: String }
  },
  
  // Card Display (for listing page)
  cardImage: {
    type: String,
    required: [true, 'Card image is required']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // Page Layout Sections
  sections: [{
    order: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ['intro', 'features', 'gallery', 'info-box', 'map', 'custom']
    },
    label: { type: String }, // e.g., "ABOUT", "PARKS", "DISCOVER", "EXPLORE"
    title: { type: String },
    description: { type: String },
    images: [{ type: String }],
    features: [{ type: String }],
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1a202c' }
  }],
  
  // Gallery
  gallery: [{
    url: { type: String },
    caption: { type: String },
    order: { type: Number, default: 0 }
  }],
  
  // Features & Amenities
  features: [{
    icon: { type: String },
    title: { type: String },
    description: { type: String }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
ProjectSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ featured: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
