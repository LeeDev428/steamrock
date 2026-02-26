const mongoose = require('mongoose');

const PropertyLocationSchema = new mongoose.Schema({
  street: {
    type: String,
    trim: true
  },
  village: {
    type: String,
    trim: true
  },
  barangay: {
    type: String,
    required: [true, 'Barangay is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City/Municipality is required'],
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

// Virtual for full address
PropertyLocationSchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.street) parts.push(this.street);
  if (this.village) parts.push(this.village);
  if (this.barangay) parts.push(`Brgy. ${this.barangay}`);
  parts.push(this.city);
  parts.push(this.province);
  if (this.postalCode) parts.push(this.postalCode);
  return parts.join(', ');
});

// Short address (City, Province)
PropertyLocationSchema.virtual('shortAddress').get(function() {
  return `${this.city}, ${this.province}`;
});

PropertyLocationSchema.set('toJSON', { virtuals: true });
PropertyLocationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PropertyLocation', PropertyLocationSchema);
