const User = require('../models/User');
const Course = require('../models/Course');
const Video = require('../models/Video');
const Payment = require('../models/Payment');
const Progress = require('../models/Progress');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments();

    // Total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Active users (logged in / had activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await Progress.distinct('userId', {
      lastWatchedAt: { $gte: sevenDaysAgo },
    });

    // Total payments
    const totalPayments = await Payment.countDocuments({ status: 'paid' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalRevenue,
        activeUsers: activeUsers.length,
        totalPayments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: { $in: ['user', 'partner'] } })
      .select('-password')
      .populate('purchasedCourses', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: { $in: ['user', 'partner'] } });

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/admin/course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;
    const course = await Course.create({ title, description, price: price || 49, thumbnail });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/admin/course/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/admin/course/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete associated videos and progress
    await Video.deleteMany({ course: course._id });
    await Progress.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(course._id);

    res.json({ success: true, message: 'Course and associated data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add video to course
// @route   POST /api/admin/course/:id/video
exports.addVideo = async (req, res) => {
  try {
    const { title, contentUrl, contentType, duration, topicId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const video = await Video.create({
      title,
      contentUrl,
      contentType: contentType || 'video',
      duration: duration || 0,
      topicId,
      course: courseId,
    });

    // Add video to course's video array
    course.videos.push(video._id);
    await course.save();

    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/admin/video/:id
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Remove from course's videos array
    await Course.findByIdAndUpdate(video.course, {
      $pull: { videos: video._id },
    });

    // Delete progress for this video
    await Progress.deleteMany({ videoId: video._id });
    await Video.findByIdAndDelete(video._id);

    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments();

    res.json({
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Make a user a partner (collaborator)
// @route   PUT /api/admin/make-partner/:userId
exports.makePartner = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Prevent admin from making themselves a partner
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change role of another admin' });
    }

    if (user.role === 'partner') {
      return res.status(400).json({ success: false, message: 'User is already a partner' });
    }

    // Update role and enable referral generation
    user.role = 'partner';
    user.canGenerateReferral = true;

    // Generate referral code if not already present
    if (!user.referralCode) {
      const crypto = require('crypto');
      const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
      user.referralCode = `REF_${randomPart}`;
    }

    await user.save();

    // Return user without sensitive fields
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('purchasedCourses', 'title');

    res.json({
      success: true,
      message: `${updatedUser.name} has been promoted to partner`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

