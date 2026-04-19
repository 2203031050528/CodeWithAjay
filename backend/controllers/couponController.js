const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const Course = require('../models/Course');

// Helper: calculate discount
const calculateDiscount = (coupon, originalPrice) => {
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((originalPrice * coupon.discountValue) / 100);
  } else {
    discount = coupon.discountValue;
  }
  // Discount cannot exceed original price
  return Math.min(discount, originalPrice);
};

// Helper: validate coupon
const validateCoupon = (coupon, userId) => {
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }
  if (!coupon.isActive) {
    return { valid: false, message: 'This coupon is no longer active' };
  }
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, message: 'This coupon has expired' };
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'This coupon has reached its usage limit' };
  }
  if (coupon.usersUsed.some((id) => id.toString() === userId.toString())) {
    return { valid: false, message: 'You have already used this coupon' };
  }
  // Prevent user from using their own referral code
  if (coupon.type === 'referral' && coupon.createdBy.toString() === userId.toString()) {
    return { valid: false, message: 'You cannot use your own referral code' };
  }
  return { valid: true };
};

// @desc    Create a new coupon (Admin only)
// @route   POST /api/coupons/create
exports.createCoupon = async (req, res) => {
  try {
    const { code, type, discountType, discountValue, usageLimit, expiryDate } = req.body;

    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type: type || 'coupon',
      discountType,
      discountValue,
      usageLimit: usageLimit || null,
      expiryDate: expiryDate || null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply coupon code
// @route   POST /api/coupons/apply
exports.applyCoupon = async (req, res) => {
  try {
    const { code, courseId } = req.body;

    if (!code || !courseId) {
      return res.status(400).json({ success: false, message: 'Code and courseId are required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    const validation = validateCoupon(coupon, req.user._id);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const discount = calculateDiscount(coupon, course.price);
    const finalPrice = course.price - discount;

    res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
        originalPrice: course.price,
        finalPrice: Math.max(0, finalPrice),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's referral stats
// @route   GET /api/coupons/my-stats
exports.getMyReferralStats = async (req, res) => {
  try {
    // Only partners and admins can view referral stats
    if (!req.user.canGenerateReferral && req.user.role !== 'admin') {
      return res.json({
        success: true,
        data: {
          eligible: false,
          referralCode: null,
          totalUses: 0,
          totalEarnings: 0,
          referralLink: null,
        },
      });
    }

    // Find user's referral coupon
    const referralCoupon = await Coupon.findOne({
      createdBy: req.user._id,
      type: 'referral',
    });

    if (!referralCoupon) {
      return res.json({
        success: true,
        data: {
          eligible: true,
          referralCode: null,
          totalUses: 0,
          totalEarnings: 0,
          referralLink: null,
        },
      });
    }

    // Get usage details
    const usages = await CouponUsage.find({ code: referralCoupon.code })
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    const totalEarnings = usages.reduce((sum, u) => sum + u.discountApplied, 0);

    res.json({
      success: true,
      data: {
        eligible: true,
        referralCode: referralCoupon.code,
        referralLink: `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${referralCoupon.code}`,
        totalUses: referralCoupon.usedCount,
        totalEarnings,
        isActive: referralCoupon.isActive,
        recentUsages: usages.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/admin/coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const coupons = await Coupon.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(filter);

    res.json({
      success: true,
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle coupon active status (Admin)
// @route   PATCH /api/admin/coupons/:id/toggle
exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/admin/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export helpers for use in paymentController
exports.validateCoupon = validateCoupon;
exports.calculateDiscount = calculateDiscount;
