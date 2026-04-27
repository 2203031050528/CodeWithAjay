const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testCase: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  output: {
    type: String,
    default: '',
  },
  expected: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem',
    required: true,
  },
  code: {
    type: String,
    required: [true, 'Code is required'],
  },
  language: {
    type: String,
    default: 'javascript',
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'error', 'timeout'],
    required: true,
  },
  results: [testResultSchema],
  executionTime: {
    type: Number, // milliseconds
    default: 0,
  },
  passedCount: {
    type: Number,
    default: 0,
  },
  totalTests: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// User's submissions for a problem, most recent first
submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
