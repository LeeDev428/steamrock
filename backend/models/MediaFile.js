const mongoose = require('mongoose');

const mediaFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  type: { type: String, default: 'general' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('MediaFile', mediaFileSchema);
