const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
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
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxLength: [5000, 'Message cannot exceed 5000 characters'],
  },
}, {
  timestamps: true,
});

// Efficient query: user's chat history for a course, ordered by time
chatMessageSchema.index({ userId: 1, courseId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
