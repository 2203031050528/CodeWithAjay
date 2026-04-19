const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getDashboardStats,
  getAllUsers,
  createCourse,
  updateCourse,
  deleteCourse,
  addVideo,
  deleteVideo,
  getAllPayments,
  makePartner,
} = require('../controllers/adminController');
const {
  getAllCoupons,
  toggleCoupon,
  deleteCoupon,
} = require('../controllers/couponController');

// All admin routes require authentication + admin role
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/course', createCourse);
router.put('/course/:id', updateCourse);
router.delete('/course/:id', deleteCourse);
router.post('/course/:id/video', addVideo);
router.delete('/video/:id', deleteVideo);
router.get('/payments', getAllPayments);
router.put('/make-partner/:userId', makePartner);

// Coupon management
router.get('/coupons', getAllCoupons);
router.patch('/coupons/:id/toggle', toggleCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
