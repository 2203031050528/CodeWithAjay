const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video_watch', 'lesson_complete', 'daily_login', 'code_submit', 'comment'],
    required: true,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // 'YYYY-MM-DD' format for easy comparison
    required: true,
  },
  activities: [activitySchema],
  totalXP: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// One record per user per day
streakSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Streak', streakSchema);
