const Progress = require('../models/Progress');
const User = require('../models/User');
const Video = require('../models/Video');

// @desc    Update video progress (called every 10 seconds from frontend)
// @route   POST /api/progress/update
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, videoId, timeSpent, videoDuration } = req.body;
    const userId = req.user._id;

    // Find or create progress record
    let progress = await Progress.findOne({ userId, courseId, videoId });

    if (progress) {
      progress.timeSpent += timeSpent; // Add incremental time
      progress.lastWatchedAt = Date.now();

      // Mark as complete if 80% of video duration watched
      if (videoDuration && progress.timeSpent >= videoDuration * 0.8 * 60) {
        progress.completed = true;
      }

      await progress.save();
    } else {
      progress = await Progress.create({
        userId,
        courseId,
        videoId,
        timeSpent,
        completed: videoDuration ? timeSpent >= videoDuration * 0.8 * 60 : false,
        lastWatchedAt: Date.now(),
      });
    }

    // Update user's total time spent
    await User.findByIdAndUpdate(userId, {
      $inc: { totalTimeSpent: timeSpent },
    });

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
