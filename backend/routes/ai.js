const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiChatLimiter } = require('../middleware/rateLimiter');
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/aiController');

router.use(protect);

router.post('/chat', aiChatLimiter, sendMessage);
router.get('/history/:courseId', getChatHistory);
router.delete('/history/:courseId', clearChatHistory);

module.exports = router;
