const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
  },
  completionDate: {
    type: Date,
    default: Date.now,
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// One certificate per user per course
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
