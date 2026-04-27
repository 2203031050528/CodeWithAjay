const User = require('../models/User');
const { getNextLevelInfo, awardXP, LEVEL_THRESHOLDS } = require('../services/xpService');
const { getStreakInfo, getStreakHistory, recordActivity, getTodayString } = require('../services/streakService');
const { notifyLevelUp, notifyStreakMilestone } = require('../services/notificationService');

// @desc    Get gamification profile (XP, level, streak, etc.)
// @route   GET /api/gamification/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('xp level currentStreak longestStreak lastActiveDate dailyLoginClaimed');
    const levelInfo = getNextLevelInfo(user.xp);
    const streakInfo = await getStreakInfo(req.user._id);

    res.json({
      success: true,
      data: {
        xp: user.xp,
        level: user.level,
        ...levelInfo,
        streak: streakInfo,
        thresholds: LEVEL_THRESHOLDS,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Claim daily login XP
// @route   POST /api/gamification/claim-daily
exports.claimDailyLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = getTodayString();
    const lastClaimed = user.dailyLoginClaimed
      ? new Date(user.dailyLoginClaimed).toISOString().split('T')[0]
      : null;

    if (lastClaimed === today) {
      return res.status(400).json({ success: false, message: 'Daily login already claimed today' });
    }

    // Award XP
    const xpResult = await awardXP(req.user._id, 'daily_login');

    // Record activity
    const { currentStreak } = await recordActivity(req.user._id, 'daily_login', xpResult.xpEarned);

    // Update daily claim date
    user.dailyLoginClaimed = new Date();
    await user.save();

    // Check for level up notification
    if (xpResult.leveledUp) {
      await notifyLevelUp(req.user._id, xpResult.newLevel);
    }

    // Check for streak milestones (7, 14, 30, 60, 100 days)
    const milestones = [7, 14, 30, 60, 100];
    if (milestones.includes(currentStreak)) {
      await notifyStreakMilestone(req.user._id, currentStreak);
    }

    res.json({
      success: true,
      data: {
        xpEarned: xpResult.xpEarned,
        totalXP: xpResult.newTotalXP,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel,
        currentStreak,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leaderboard (top users by XP)
// @route   GET /api/gamification/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const leaders = await User.find({ role: { $in: ['user', 'partner'] } })
      .select('name xp level currentStreak avatar')
      .sort({ xp: -1 })
      .limit(limit);

    // Find current user's rank
    const userRank = await User.countDocuments({
      role: { $in: ['user', 'partner'] },
      xp: { $gt: req.user.xp || 0 },
    }) + 1;

    res.json({
      success: true,
      data: {
        leaderboard: leaders,
        userRank,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get streak history
// @route   GET /api/gamification/streak-history
exports.getStreakHistoryData = async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90);
    const history = await getStreakHistory(req.user._id, days);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
