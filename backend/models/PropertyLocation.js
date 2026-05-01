const mongoose = require('mongoose');

const PropertyLocationSchema = new mongoose.Schema({
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
  // Full address string pasted from Google Maps (e.g. "XVHJ+7GQ, Diokno Hwy, Lemery, Batangas, Philippines")
  mapQuery: {
    type: String,
    trim: true
  },
  // Legacy fields kept for backward compatibility
  street: { type: String, trim: true },
  village: { type: String, trim: true },
  barangay: { type: String, trim: true },
  postalCode: { type: String, trim: true },
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
