const express = require('express');
const router = express.Router();
const { updateProgress, getUserProgress, getDailyStats, getContinueLearning } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/update', protect, updateProgress);
router.get('/continue', protect, getContinueLearning);
router.get('/daily/stats', protect, getDailyStats);
router.get('/:courseId', protect, getUserProgress);

module.exports = router;
