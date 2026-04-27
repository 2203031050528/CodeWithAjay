const Comment = require('../models/Comment');
const { recordActivity } = require('../services/streakService');
const { awardXP } = require('../services/xpService');
const { notifyCommentReply } = require('../services/notificationService');

// @desc    Get comments for a course (optionally filtered by videoId)
// @route   GET /api/comments/:courseId
exports.getComments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { videoId, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { courseId, parentId: null }; // Top-level only
    if (videoId) filter.videoId = videoId;

    const comments = await Comment.find(filter)
      .populate('userId', 'name avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentId: comment._id })
          .populate('userId', 'name avatar level')
          .sort({ createdAt: 1 })
          .limit(5);
        const totalReplies = await Comment.countDocuments({ parentId: comment._id });
        return { ...comment.toObject(), replies, totalReplies };
      })
    );

    const total = await Comment.countDocuments(filter);

    res.json({ success: true, data: commentsWithReplies, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post a comment
// @route   POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { courseId, videoId, content } = req.body;
    if (!courseId || !content) return res.status(400).json({ success: false, message: 'courseId and content are required' });

    const comment = await Comment.create({
      userId: req.user._id, courseId, videoId: videoId || null, content,
    });

    const populated = await Comment.findById(comment._id).populate('userId', 'name avatar level');

    // Award XP for commenting
    await awardXP(req.user._id, 'comment');
    await recordActivity(req.user._id, 'comment', 5, { commentId: comment._id.toString() });

    res.status(201).json({ success: true, data: { ...populated.toObject(), replies: [], totalReplies: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to a comment
// @route   POST /api/comments/:id/reply
exports.replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const reply = await Comment.create({
      userId: req.user._id, courseId: parentComment.courseId,
      videoId: parentComment.videoId, content, parentId: parentComment._id,
    });

    const populated = await Comment.findById(reply._id).populate('userId', 'name avatar level');

    // Notify parent comment author (if different user)
    if (parentComment.userId.toString() !== req.user._id.toString()) {
      await notifyCommentReply(parentComment.userId, req.user.name, parentComment.courseId);
    }

    await awardXP(req.user._id, 'comment');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like/unlike a comment
// @route   POST /api/comments/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const userId = req.user._id;
    const hasLiked = comment.likes.some(id => id.toString() === userId.toString());

    if (hasLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
      comment.likeCount = Math.max(0, comment.likeCount - 1);
    } else {
      comment.likes.push(userId);
      comment.likeCount += 1;
    }

    await comment.save();
    res.json({ success: true, data: { liked: !hasLiked, likeCount: comment.likeCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete own comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    // Only owner or admin can delete
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete replies too
    await Comment.deleteMany({ parentId: comment._id });
    await Comment.findByIdAndDelete(comment._id);

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
