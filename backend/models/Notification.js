const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'course_purchase',
      'course_complete',
      'new_content',
      'xp_earned',
      'level_up',
      'streak_milestone',
      'certificate',
      'comment_reply',
    ],
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
  },
  link: {
    type: String,
    default: '',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// User's notifications, unread first, newest first
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('Notification', notificationSchema);
