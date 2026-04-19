const mongoose = require('mongoose');

const couponUsageSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  discountApplied: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Prevent duplicate usage: one user, one code, one course
couponUsageSchema.index({ userId: 1, code: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CouponUsage', couponUsageSchema);
