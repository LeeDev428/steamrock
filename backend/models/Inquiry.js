const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  propertyInterest: {
    type: String,
    default: 'General Inquiry'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Closed'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', InquirySchema);
