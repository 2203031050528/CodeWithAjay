const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  language: {
    type: String,
    enum: ['javascript'],
    default: 'javascript',
  },
  starterCode: {
    type: String,
    default: '// Write your solution here\n',
  },
  solutionCode: {
    type: String,
    default: '',
  },
  testCases: {
    type: [testCaseSchema],
    validate: {
      validator: (v) => v.length >= 1,
      message: 'At least one test case is required',
    },
  },
  xpReward: {
    type: Number,
    default: 50,
    min: 0,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

codingProblemSchema.index({ difficulty: 1, language: 1 });
codingProblemSchema.index({ courseId: 1 });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
