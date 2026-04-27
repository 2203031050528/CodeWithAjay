const User = require('../models/User');

// XP rewards for different activities
const XP_REWARDS = {
  video_watch: 10,       // Per video progress update (throttled)
  lesson_complete: 25,   // Completing a video/lesson
  daily_login: 15,       // First login of the day
  code_submit: 50,       // Passing all test cases
  comment: 5,            // Posting a comment
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  { level: 'Beginner', minXP: 0 },
  { level: 'Intermediate', minXP: 500 },
  { level: 'Pro', minXP: 2000 },
  { level: 'Expert', minXP: 5000 },
];

/**
 * Calculate level from XP
 * @param {number} xp
 * @returns {string} level name
 */
const calculateLevel = (xp) => {
  let currentLevel = 'Beginner';
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.minXP) {
      currentLevel = threshold.level;
    }
  }
  return currentLevel;
};

/**
 * Get XP needed for next level
 * @param {number} xp
 * @returns {{ nextLevel: string|null, xpNeeded: number, currentLevel: string }}
 */
const getNextLevelInfo = (xp) => {
  const currentLevel = calculateLevel(xp);
  const currentIndex = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel);
  const nextThreshold = LEVEL_THRESHOLDS[currentIndex + 1];

  return {
    currentLevel,
    nextLevel: nextThreshold?.level || null,
    xpNeeded: nextThreshold ? nextThreshold.minXP - xp : 0,
    xpProgress: nextThreshold
      ? ((xp - LEVEL_THRESHOLDS[currentIndex].minXP) /
         (nextThreshold.minXP - LEVEL_THRESHOLDS[currentIndex].minXP)) * 100
      : 100,
  };
};

/**
 * Award XP to a user and update their level
 * @param {string} userId
 * @param {string} activityType - one of XP_REWARDS keys
 * @param {number} customXP - override default XP (optional)
 * @returns {{ xpEarned, newTotalXP, leveledUp, newLevel }}
 */
const awardXP = async (userId, activityType, customXP = null) => {
  const xpToAdd = customXP !== null ? customXP : (XP_REWARDS[activityType] || 0);

  if (xpToAdd <= 0) return { xpEarned: 0, newTotalXP: 0, leveledUp: false, newLevel: null };

  const user = await User.findById(userId);
  if (!user) return { xpEarned: 0, newTotalXP: 0, leveledUp: false, newLevel: null };

  const oldLevel = user.level;
  const newXP = (user.xp || 0) + xpToAdd;
  const newLevel = calculateLevel(newXP);

  user.xp = newXP;
  user.level = newLevel;
  await user.save();

  return {
    xpEarned: xpToAdd,
    newTotalXP: newXP,
    leveledUp: oldLevel !== newLevel,
    newLevel,
    oldLevel,
  };
};

module.exports = {
  XP_REWARDS,
  LEVEL_THRESHOLDS,
  calculateLevel,
  getNextLevelInfo,
  awardXP,
};
