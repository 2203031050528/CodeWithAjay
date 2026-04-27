const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const { codeExecLimiter } = require('../middleware/rateLimiter');
const {
  getProblems, getProblem, submitCode,
  createProblem, updateProblem, deleteProblem,
} = require('../controllers/codingController');

// User routes (protected)
router.get('/problems', protect, getProblems);
router.get('/problems/:id', protect, getProblem);
router.post('/submit/:id', protect, codeExecLimiter, submitCode);

// Admin routes
router.post('/problems', protect, admin, createProblem);
router.put('/problems/:id', protect, admin, updateProblem);
router.delete('/problems/:id', protect, admin, deleteProblem);

module.exports = router;
