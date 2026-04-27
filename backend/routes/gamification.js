const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, claimDailyLogin, getLeaderboard, getStreakHistoryData } = require('../controllers/gamificationController');

router.use(protect);

router.get('/profile', getProfile);
router.post('/claim-daily', claimDailyLogin);
router.get('/leaderboard', getLeaderboard);
router.get('/streak-history', getStreakHistoryData);

module.exports = router;
