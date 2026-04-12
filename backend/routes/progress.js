const express = require('express');
const router = express.Router();
const { updateProgress, getUserProgress, getDailyStats } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/update', protect, updateProgress);
router.get('/daily/stats', protect, getDailyStats);
router.get('/:courseId', protect, getUserProgress);

module.exports = router;
