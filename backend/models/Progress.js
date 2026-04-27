const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
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
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },
  lastPosition: {
    type: Number, // seconds into the video
    default: 0,
  },
  timeSpentToday: {
    type: Number, // reset daily via streak service
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, courseId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
