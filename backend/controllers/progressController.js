const Progress = require('../models/Progress');
const User = require('../models/User');
const Video = require('../models/Video');
const { awardXP } = require('../services/xpService');
const { recordActivity } = require('../services/streakService');
const { notifyCourseComplete, notifyLevelUp } = require('../services/notificationService');

// @desc    Update video progress (called every 10 seconds from frontend)
// @route   POST /api/progress/update
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, videoId, timeSpent, videoDuration, lastPosition } = req.body;
    const userId = req.user._id;

    // Find or create progress record
    let progress = await Progress.findOne({ userId, courseId, videoId });
    let wasAlreadyComplete = false;

    if (progress) {
      wasAlreadyComplete = progress.completed;
      progress.timeSpent += timeSpent;
      progress.lastWatchedAt = Date.now();
      if (lastPosition !== undefined) progress.lastPosition = lastPosition;

      // Mark as complete if 80% of video duration watched
      if (videoDuration && progress.timeSpent >= videoDuration * 0.8 * 60) {
        progress.completed = true;
      }

      await progress.save();
    } else {
      const isComplete = videoDuration ? timeSpent >= videoDuration * 0.8 * 60 : false;
      progress = await Progress.create({
        userId, courseId, videoId, timeSpent,
        completed: isComplete,
        lastWatchedAt: Date.now(),
        lastPosition: lastPosition || 0,
      });
    }

    // Update user's total time spent
    await User.findByIdAndUpdate(userId, { $inc: { totalTimeSpent: timeSpent } });

    // === Gamification hooks ===
    // Award XP for watching (throttled — only on each update call, 10XP)
    const xpResult = await awardXP(userId, 'video_watch');
    await recordActivity(userId, 'video_watch', xpResult.xpEarned, { courseId, videoId });

    // If lesson just completed (wasn't before)
    if (progress.completed && !wasAlreadyComplete) {
      const lessonXP = await awardXP(userId, 'lesson_complete');
      await recordActivity(userId, 'lesson_complete', lessonXP.xpEarned, { courseId, videoId });

      if (lessonXP.leveledUp) {
        await notifyLevelUp(userId, lessonXP.newLevel);
      }

      // Check if entire course is now complete
      const totalVideos = await Video.countDocuments({ course: courseId });
      const completedCount = await Progress.countDocuments({ userId, courseId, completed: true });
      if (totalVideos > 0 && completedCount >= totalVideos) {
        const Course = require('../models/Course');
        const course = await Course.findById(courseId).select('title');
        if (course) await notifyCourseComplete(userId, course.title, courseId);
      }
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's progress for a course
// @route   GET /api/progress/:courseId
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.user._id,
      courseId: req.params.courseId,
    }).populate('videoId', 'title duration order');

    // Calculate overall progress
    const totalVideos = await Video.countDocuments({ course: req.params.courseId });
    const completedVideos = progress.filter(p => p.completed).length;
    const totalTimeSpent = progress.reduce((acc, p) => acc + p.timeSpent, 0);

    res.json({
      success: true,
      data: {
        progress,
        stats: {
          totalVideos,
          completedVideos,
          percentComplete: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
          totalTimeSpent,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily learning stats
// @route   GET /api/progress/daily/stats
exports.getDailyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get last 7 days of progress
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Progress.aggregate([
      {
        $match: {
          userId: userId,
          lastWatchedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastWatchedAt' },
          },
          totalTime: { $sum: '$timeSpent' },
          videosWatched: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: dailyStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get "Continue Learning" data — last watched across all courses
// @route   GET /api/progress/continue
exports.getContinueLearning = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get the most recently watched progress per course
    const latestProgress = await Progress.aggregate([
      { $match: { userId } },
      { $sort: { lastWatchedAt: -1 } },
      { $group: {
        _id: '$courseId',
        videoId: { $first: '$videoId' },
        lastWatchedAt: { $first: '$lastWatchedAt' },
        lastPosition: { $first: '$lastPosition' },
        timeSpent: { $first: '$timeSpent' },
      }},
      { $sort: { lastWatchedAt: -1 } },
      { $limit: 5 },
    ]);

    // Populate course and video info
    const Course = require('../models/Course');
    const results = await Promise.all(
      latestProgress.map(async (p) => {
        const course = await Course.findById(p._id).select('title thumbnail');
        const video = await Video.findById(p.videoId).select('title duration');
        const totalVideos = await Video.countDocuments({ course: p._id });
        const completedVideos = await Progress.countDocuments({ userId, courseId: p._id, completed: true });
        return {
          courseId: p._id,
          courseTitle: course?.title,
          courseThumbnail: course?.thumbnail,
          videoId: p.videoId,
          videoTitle: video?.title,
          lastPosition: p.lastPosition,
          lastWatchedAt: p.lastWatchedAt,
          percentComplete: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
        };
      })
    );

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
