const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create an in-app notification
 * @param {Object} params - { userId, type, title, message, link, metadata }
 * @returns {Object} created notification
 */
const createNotification = async ({ userId, type, title, message, link = '', metadata = {} }) => {
  const notification = await Notification.create({
    userId, type, title, message, link, metadata,
  });

  // Increment unread counter
  await User.findByIdAndUpdate(userId, { $inc: { unreadNotifications: 1 } });

  return notification;
};

/**
 * Notify user about course purchase
 */
const notifyCoursePurchase = async (userId, courseName, courseId) => {
  return createNotification({
    userId,
    type: 'course_purchase',
    title: 'Course Purchased! 🎉',
    message: `You've unlocked "${courseName}". Start learning now!`,
    link: `/course/${courseId}`,
    metadata: { courseId },
  });
};

/**
 * Notify user about course completion
 */
const notifyCourseComplete = async (userId, courseName, courseId) => {
  return createNotification({
    userId,
    type: 'course_complete',
    title: 'Course Completed! 🏆',
    message: `Congratulations! You've completed "${courseName}".`,
    link: `/certificates`,
    metadata: { courseId },
  });
};

/**
 * Notify user about level up
 */
const notifyLevelUp = async (userId, newLevel) => {
  return createNotification({
    userId,
    type: 'level_up',
    title: `Level Up! ⚡`,
    message: `You've reached ${newLevel} level! Keep pushing!`,
    link: `/dashboard`,
  });
};

/**
 * Notify user about XP earned
 */
const notifyXPEarned = async (userId, xp, reason) => {
  return createNotification({
    userId,
    type: 'xp_earned',
    title: `+${xp} XP Earned! ✨`,
    message: reason,
    link: `/dashboard`,
  });
};

/**
 * Notify user about streak milestone
 */
const notifyStreakMilestone = async (userId, streakCount) => {
  return createNotification({
    userId,
    type: 'streak_milestone',
    title: `${streakCount}-Day Streak! 🔥`,
    message: `Amazing! You've maintained a ${streakCount}-day learning streak!`,
    link: `/dashboard`,
  });
};

/**
 * Notify user about certificate
 */
const notifyCertificate = async (userId, courseName, certId) => {
  return createNotification({
    userId,
    type: 'certificate',
    title: 'Certificate Ready! 📜',
    message: `Your certificate for "${courseName}" is ready to download.`,
    link: `/certificates`,
    metadata: { certId },
  });
};

/**
 * Notify user about comment reply
 */
const notifyCommentReply = async (userId, replierName, courseId) => {
  return createNotification({
    userId,
    type: 'comment_reply',
    title: 'New Reply 💬',
    message: `${replierName} replied to your comment.`,
    link: `/course/${courseId}`,
    metadata: { courseId },
  });
};

module.exports = {
  createNotification,
  notifyCoursePurchase,
  notifyCourseComplete,
  notifyLevelUp,
  notifyXPEarned,
  notifyStreakMilestone,
  notifyCertificate,
  notifyCommentReply,
};
