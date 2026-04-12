const Course = require('../models/Course');
const Video = require('../models/Video');

// @desc    Get all published courses
// @route   GET /api/courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('videos', 'title duration order')
      .sort({ createdAt: -1 });

    const coursesWithMeta = courses.map(course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      videoCount: course.videos.length,
      totalDuration: course.videos.reduce((acc, v) => acc + (v.duration || 0), 0),
      createdAt: course.createdAt,
    }));

    res.json({ success: true, data: coursesWithMeta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'videos',
        select: 'title contentUrl contentType duration topicId',
      });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user has purchased this course
    const hasPurchased = req.user && req.user.purchasedCourses.includes(course._id.toString());

    // If not purchased, hide content URLs
    const courseData = course.toObject();
    if (!hasPurchased) {
      courseData.videos = courseData.videos.map(v => ({
        _id: v._id,
        title: v.title,
        contentType: v.contentType,
        duration: v.duration,
        topicId: v.topicId,
        // contentUrl is hidden
      }));
    }

    res.json({
      success: true,
      data: courseData,
      hasPurchased,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
