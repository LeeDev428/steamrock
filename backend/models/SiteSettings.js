const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  // Only one document should exist - singleton pattern
  key: {
    type: String,
    default: 'main',
    unique: true
  },
  
  // Site Info
  siteName: {
    type: String,
    default: 'Streamrock Realty'
  },
  tagline: {
    type: String,
    default: 'Your Trusted Real Estate Partner'
  },
  logo: {
    type: String
  },
  favicon: {
    type: String
  },
  
  // Hero Section
  hero: {
    type: {
      type: String,
      enum: ['image', 'video', 'carousel'],
      default: 'carousel'
    },
    items: [{
      mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
      url: { type: String },
      title: { type: String },
      subtitle: { type: String },
      buttonText: { type: String },
      buttonLink: { type: String },
      order: { type: Number, default: 0 }
    }]
  },
  
  // Navigation Links
  navLinks: [{
    name: { type: String },
    path: { type: String },
    hasDropdown: { type: Boolean, default: false },
    dropdownItems: [{
      name: { type: String },
      path: { type: String }
    }],
    order: { type: Number, default: 0 }
  }],
  
  // Homepage Sections
  homeSections: [{
    sectionId: { type: String },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1a202c' },
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  }],
  
  // Feature Icons Section (like Landco's "Seaside Residential, Leisure Tourism, etc.")
  featureIcons: [{
    icon: { type: String },
    title: { type: String },
    order: { type: Number, default: 0 }
  }],
  
  // Contact Info
  contact: {
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    mapEmbed: { type: String }
  },
  
  // Social Links
  social: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    linkedin: { type: String }
  },
  
  // Footer
  footer: {
    copyright: { type: String },
    links: [{
      name: { type: String },
      url: { type: String }
    }]
  },
  
  // SEO
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
