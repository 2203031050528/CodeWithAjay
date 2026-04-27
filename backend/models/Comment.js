const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxLength: [2000, 'Comment cannot exceed 2000 characters'],
    trim: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likeCount: {
    type: Number,
    default: 0,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Fetch comments for a course/video, ordered by newest
commentSchema.index({ courseId: 1, videoId: 1, createdAt: -1 });
// Fetch replies for a parent comment
commentSchema.index({ parentId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
