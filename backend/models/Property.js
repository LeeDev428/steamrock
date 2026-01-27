const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Nuvali Properties', 'Vermosa Properties', 'Southmont Properties', 'Batangas Beach Properties', 'Pre-selling Properties', 'Bank Foreclosed Properties']
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Sold'],
    default: 'Available'
  },
  propertyType: {
    type: String,
    enum: ['House and Lot', 'Condo', 'Lot', 'Commercial'],
    required: true
  },
  bedrooms: Number,
  bathrooms: Number,
  floorArea: Number,
  lotArea: Number,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', PropertySchema);
