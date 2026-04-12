const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById } = require('../controllers/courseController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', getAllCourses);
router.get('/:id', optionalAuth, getCourseById);

module.exports = router;
