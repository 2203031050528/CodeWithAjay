const CodingProblem = require('../models/CodingProblem');
const Submission = require('../models/Submission');
const { runTestCases } = require('../services/codeExecutor');
const { awardXP } = require('../services/xpService');
const { recordActivity } = require('../services/streakService');
const { notifyXPEarned } = require('../services/notificationService');

// @desc    Get all coding problems
// @route   GET /api/coding/problems
exports.getProblems = async (req, res) => {
  try {
    const { difficulty, courseId } = req.query;
    const filter = { isPublished: true };
    if (difficulty) filter.difficulty = difficulty;
    if (courseId) filter.courseId = courseId;

    const problems = await CodingProblem.find(filter)
      .select('title description difficulty language xpReward courseId createdAt')
      .sort({ difficulty: 1, createdAt: -1 });

    // Attach user's best submission status
    const problemIds = problems.map(p => p._id);
    const bestSubmissions = await Submission.aggregate([
      { $match: { userId: req.user._id, problemId: { $in: problemIds } } },
      { $sort: { passedCount: -1, createdAt: -1 } },
      { $group: { _id: '$problemId', bestStatus: { $first: '$status' }, bestPassed: { $first: '$passedCount' } } },
    ]);
    const statusMap = {};
    bestSubmissions.forEach(s => { statusMap[s._id.toString()] = s.bestStatus; });

    const result = problems.map(p => ({
      ...p.toObject(),
      userStatus: statusMap[p._id.toString()] || 'unattempted',
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single problem
// @route   GET /api/coding/problems/:id
exports.getProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    const data = problem.toObject();
    // Hide solution and hidden test case details from users
    delete data.solutionCode;
    data.testCases = data.testCases.map(tc => tc.isHidden ? { ...tc, input: '[Hidden]', expectedOutput: '[Hidden]' } : tc);

    // Get user's submissions
    const submissions = await Submission.find({ userId: req.user._id, problemId: problem._id })
      .sort({ createdAt: -1 }).limit(10).select('status passedCount totalTests createdAt executionTime');

    res.json({ success: true, data, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit code for a problem
// @route   POST /api/coding/submit/:id
exports.submitCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) return res.status(400).json({ success: false, message: 'Code is required' });

    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    // Run against all test cases
    const { status, results, passedCount, totalTests, executionTime } = runTestCases(code, problem.testCases);

    // Save submission
    const submission = await Submission.create({
      userId: req.user._id, problemId: problem._id, code, language: problem.language,
      status, results, executionTime, passedCount, totalTests,
    });

    // Award XP if all tests passed
    let xpResult = null;
    if (status === 'passed') {
      // Check if this is their first passing submission
      const prevPassed = await Submission.countDocuments({
        userId: req.user._id, problemId: problem._id, status: 'passed', _id: { $ne: submission._id },
      });
      if (prevPassed === 0) {
        xpResult = await awardXP(req.user._id, 'code_submit', problem.xpReward);
        await recordActivity(req.user._id, 'code_submit', problem.xpReward, { problemId: problem._id.toString() });
        if (xpResult.xpEarned > 0) {
          await notifyXPEarned(req.user._id, xpResult.xpEarned, `Solved "${problem.title}" — ${xpResult.xpEarned} XP earned!`);
        }
      }
    }

    // Hide hidden test case details in response
    const safeResults = results.map((r, i) => {
      if (problem.testCases[i]?.isHidden) {
        return { testCase: r.testCase, passed: r.passed, output: '[Hidden]', expected: '[Hidden]', error: r.error ? 'Error on hidden test' : '' };
      }
      return r;
    });

    res.json({ success: true, data: { status, results: safeResults, passedCount, totalTests, executionTime, xpEarned: xpResult?.xpEarned || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === ADMIN ENDPOINTS ===

// @desc    Create a coding problem (Admin)
// @route   POST /api/coding/problems
exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, language, starterCode, solutionCode, testCases, xpReward, courseId } = req.body;
    const problem = await CodingProblem.create({
      title, description, difficulty, language, starterCode, solutionCode,
      testCases, xpReward: xpReward || 50, courseId: courseId || null, createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a coding problem (Admin)
// @route   PUT /api/coding/problems/:id
exports.updateProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a coding problem (Admin)
// @route   DELETE /api/coding/problems/:id
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    await Submission.deleteMany({ problemId: problem._id });
    res.json({ success: true, message: 'Problem and submissions deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
