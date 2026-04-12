const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');

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
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already purchased
    if (req.user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Course already purchased' });
    }

    const options = {
      amount: course.price * 100, // Convert to paise (₹49 → 4900 paise)
      currency: 'INR',
      receipt: `receipt_${req.user._id}_${courseId}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        courseId: courseId,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Save payment record
    await Payment.create({
      userId: req.user._id,
      courseId,
      amount: course.price,
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
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      }
    );

    // Add course to user's purchased courses
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { purchasedCourses: courseId },
    });

    res.json({ success: true, message: 'Payment verified successfully. Course unlocked!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
