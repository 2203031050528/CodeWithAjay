const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getComments, createComment, replyToComment, toggleLike, deleteComment } = require('../controllers/commentController');

router.use(protect);

router.get('/:courseId', getComments);
router.post('/', createComment);
router.post('/:id/reply', replyToComment);
router.post('/:id/like', toggleLike);
router.delete('/:id', deleteComment);

module.exports = router;
