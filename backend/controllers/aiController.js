const ChatMessage = require('../models/ChatMessage');
const Course = require('../models/Course');
const Video = require('../models/Video');
const { generateResponse } = require('../services/aiService');
const { recordActivity } = require('../services/streakService');

// @desc    Send message to AI and get response
// @route   POST /api/ai/chat
exports.sendMessage = async (req, res) => {
  try {
    const { courseId, videoId, message } = req.body;
    const userId = req.user._id;

    if (!courseId || !message) {
      return res.status(400).json({ success: false, message: 'courseId and message are required' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 5000 chars)' });
    }

    // Get context
    const course = await Course.findById(courseId).select('title');
    let videoTitle = null;
    if (videoId) {
      const video = await Video.findById(videoId).select('title');
      videoTitle = video?.title;
    }

    // Get last 20 messages for context
    const history = await ChatMessage.find({ userId, courseId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    history.reverse();

    // Save user message
    await ChatMessage.create({ userId, courseId, videoId: videoId || null, role: 'user', content: message });

    // Generate AI response
    const aiResponse = await generateResponse(
      history.map(m => ({ role: m.role, content: m.content })),
      message,
      { courseName: course?.title, videoTitle }
    );

    // Save AI response
    const savedResponse = await ChatMessage.create({
      userId, courseId, videoId: videoId || null, role: 'assistant', content: aiResponse,
    });

    // Record activity (no XP for chat, just tracking)
    await recordActivity(userId, 'video_watch', 0, { type: 'ai_chat' });

    res.json({ success: true, data: { role: 'assistant', content: aiResponse, _id: savedResponse._id, createdAt: savedResponse.createdAt } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history for a course
// @route   GET /api/ai/history/:courseId
exports.getChatHistory = async (req, res) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await ChatMessage.find({ userId: req.user._id, courseId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await ChatMessage.countDocuments({ userId: req.user._id, courseId });

    res.json({ success: true, data: messages, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear chat history for a course
// @route   DELETE /api/ai/history/:courseId
exports.clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id, courseId: req.params.courseId });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
