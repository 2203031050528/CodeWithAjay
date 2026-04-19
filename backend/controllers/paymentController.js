const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const { validateCoupon, calculateDiscount } = require('./couponController');

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Get Razorpay public key
// @route   GET /api/payment/key
exports.getRazorpayKey = (req, res) => {
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already purchased
    if (req.user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Course already purchased' });
    }

    let finalPrice = course.price;
    let discount = 0;
    let appliedCouponCode = null;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      const validation = validateCoupon(coupon, req.user._id);

      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.message });
      }

      discount = calculateDiscount(coupon, course.price);
      finalPrice = Math.max(0, course.price - discount);
      appliedCouponCode = coupon.code;
    }

    // If price is 0 after discount, skip Razorpay and grant access directly
    if (finalPrice === 0) {
      // Record coupon usage
      if (appliedCouponCode) {
        await Coupon.findOneAndUpdate(
          { code: appliedCouponCode },
          {
            $inc: { usedCount: 1 },
            $addToSet: { usersUsed: req.user._id },
          }
        );

        await CouponUsage.create({
          code: appliedCouponCode,
          userId: req.user._id,
          courseId,
          discountApplied: discount,
          originalPrice: course.price,
          finalPrice: 0,
        });
      }

      // Grant course access
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { purchasedCourses: courseId },
      });

      // Create a payment record for tracking
      await Payment.create({
        userId: req.user._id,
        courseId,
        amount: 0,
        razorpayOrderId: `free_${Date.now()}`,
        status: 'paid',
        couponCode: appliedCouponCode,
        discount,
        originalAmount: course.price,
      });

      return res.json({
        success: true,
        data: {
          free: true,
          message: 'Course unlocked for free with 100% discount!',
        },
      });
    }

    const receiptId = `rcpt_${req.user._id.toString().slice(-6)}_${Date.now().toString().slice(-6)}`;

    const options = {
      amount: finalPrice * 100, // Convert to paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId: req.user._id.toString(),
        courseId: courseId.toString(),
        couponCode: appliedCouponCode || '',
        discount: discount.toString(),
        originalPrice: course.price.toString(),
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Save payment record
    await Payment.create({
      userId: req.user._id,
      courseId,
      amount: finalPrice,
      originalAmount: course.price,
      discount,
      couponCode: appliedCouponCode,
      razorpayOrderId: order.id,
      status: 'created',
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        courseName: course.title,
        originalPrice: course.price,
        discount,
        finalPrice,
        couponApplied: appliedCouponCode,
      },
    });
  } catch (error) {
    const errorMessage = error.error?.description || error.message || 'Payment initiation failed';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Get the payment record to find coupon details
    const paymentRecord = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      }
    );

    // Record coupon usage after successful payment
    if (paymentRecord?.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: paymentRecord.couponCode },
        {
          $inc: { usedCount: 1 },
          $addToSet: { usersUsed: req.user._id },
        }
      );

      await CouponUsage.create({
        code: paymentRecord.couponCode,
        userId: req.user._id,
        courseId,
        discountApplied: paymentRecord.discount || 0,
        originalPrice: paymentRecord.originalAmount || paymentRecord.amount,
        finalPrice: paymentRecord.amount,
      });
    }

    // Add course to user's purchased courses
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { purchasedCourses: courseId },
    });

    res.json({ success: true, message: 'Payment verified successfully. Course unlocked!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
