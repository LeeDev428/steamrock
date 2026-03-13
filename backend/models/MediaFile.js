const mongoose = require('mongoose');

const mediaFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  folder: { type: String, default: 'StreamRock/general' },
  resourceType: { type: String, default: 'image' },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  type: { type: String, default: 'general' },
  category: { type: String, default: '' },
  entity: { type: String, default: '' },
  field: { type: String, default: '' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('MediaFile', mediaFileSchema);
