const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
  },
  contentType: {
    type: String,
    enum: ['video', 'pdf', 'image'],
    default: 'video'
  },
  contentUrl: {
    type: String,
    required: [true, 'Content URL is required'],
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  topicId: {
    type: String,
    required: [true, 'Syllabus topic ID is required to map content correctly'],
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Video', videoSchema);
