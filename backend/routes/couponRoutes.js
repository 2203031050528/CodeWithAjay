const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCoupon, applyCoupon, getMyReferralStats } = require('../controllers/couponController');
const admin = require('../middleware/admin');

// Protected routes (requires login)
router.post('/apply', protect, applyCoupon);
router.get('/my-stats', protect, getMyReferralStats);

// Admin-only routes
router.post('/create', protect, admin, createCoupon);

module.exports = router;
