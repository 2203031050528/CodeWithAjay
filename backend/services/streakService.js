const Streak = require('../models/Streak');
const User = require('../models/User');

/**
 * Get today's date string in YYYY-MM-DD format
 * @returns {string}
 */
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get yesterday's date string
 * @returns {string}
 */
const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

/**
 * Record a user activity and update streak
 * @param {string} userId
 * @param {string} activityType - e.g., 'video_watch', 'lesson_complete'
 * @param {number} xpEarned
 * @param {Object} metadata - additional info
 * @returns {{ streak: Object, streakUpdated: boolean }}
 */
const recordActivity = async (userId, activityType, xpEarned = 0, metadata = {}) => {
  const today = getTodayString();

  // Upsert today's streak record
  const streakRecord = await Streak.findOneAndUpdate(
    { userId, date: today },
    {
      $push: {
        activities: { type: activityType, xpEarned, metadata, timestamp: new Date() },
      },
      $inc: { totalXP: xpEarned },
    },
    { upsert: true, new: true }
  );

  // Update user's streak count
  const user = await User.findById(userId);
  if (!user) return { streak: streakRecord, streakUpdated: false };

  const lastActive = user.lastActiveDate
    ? new Date(user.lastActiveDate).toISOString().split('T')[0]
    : null;

  let streakUpdated = false;

  if (lastActive !== today) {
    // First activity of the day
    if (lastActive === getYesterdayString()) {
      // Continued streak
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else if (lastActive === null || lastActive < getYesterdayString()) {
      // Streak broken or first ever — reset to 1
      user.currentStreak = 1;
    }

    // Update longest streak
    if (user.currentStreak > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    user.lastActiveDate = new Date();
    await user.save();
    streakUpdated = true;
  }

  return { streak: streakRecord, streakUpdated, currentStreak: user.currentStreak };
};

/**
 * Get user's streak info
 * @param {string} userId
 * @returns {{ currentStreak, longestStreak, todayActivities, lastActiveDate }}
 */
const getStreakInfo = async (userId) => {
  const user = await User.findById(userId).select('currentStreak longestStreak lastActiveDate');
  const today = getTodayString();

  // Check if streak is still active
  const lastActive = user?.lastActiveDate
    ? new Date(user.lastActiveDate).toISOString().split('T')[0]
    : null;

  let currentStreak = user?.currentStreak || 0;

  // If last active was before yesterday, streak is broken
  if (lastActive && lastActive < getYesterdayString()) {
    currentStreak = 0;
    // Update in DB
    await User.findByIdAndUpdate(userId, { currentStreak: 0 });
  }

  // Get today's activities
  const todayRecord = await Streak.findOne({ userId, date: today });

  return {
    currentStreak,
    longestStreak: user?.longestStreak || 0,
    todayActivities: todayRecord?.activities || [],
    todayXP: todayRecord?.totalXP || 0,
    lastActiveDate: user?.lastActiveDate,
    isActiveToday: lastActive === today,
  };
};

/**
 * Get streak history for last N days
 * @param {string} userId
 * @param {number} days
 * @returns {Array}
 */
const getStreakHistory = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startString = startDate.toISOString().split('T')[0];

  return Streak.find({
    userId,
    date: { $gte: startString },
  }).sort({ date: 1 });
};

module.exports = {
  recordActivity,
  getStreakInfo,
  getStreakHistory,
  getTodayString,
};
