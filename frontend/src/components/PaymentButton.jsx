import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiLightningBolt, HiTag, HiX, HiCheck } from 'react-icons/hi';

const PaymentButton = ({ courseId, courseName, price, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const { user } = useAuth();

  // Auto-detect stored referral code
  useEffect(() => {
    const storedRef = localStorage.getItem('cwa_referral_code');
    if (storedRef && !appliedCoupon) {
      setCouponCode(storedRef);
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await API.post('/coupons/apply', {
        code: couponCode.trim(),
        courseId,
      });
      setAppliedCoupon(data.data);
      toast.success(`Coupon applied! ₹${data.data.discount} off`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    localStorage.removeItem('cwa_referral_code');
  };

  const displayPrice = appliedCoupon ? appliedCoupon.finalPrice : price;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order with optional coupon
      const { data: orderData } = await API.post('/payment/create-order', {
        courseId,
        couponCode: appliedCoupon?.code || null,
      });

      // Handle free course (100% discount)
      if (orderData.data.free) {
        toast.success('🎉 Course unlocked for free!');
        localStorage.removeItem('cwa_referral_code');
        if (onSuccess) onSuccess();
        return;
      }

      // Get Razorpay key
      const { data: keyData } = await API.get('/payment/key');

      const options = {
        key: keyData.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'CodeWithAjay',
        description: `Purchase: ${courseName}`,
        order_id: orderData.data.orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response) => {
          try {
            // Verify payment
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            });

            toast.success('🎉 Payment successful! Course unlocked!');
            localStorage.removeItem('cwa_referral_code');
            if (onSuccess) onSuccess();
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Coupon Input */}
      <div className="glass p-4" style={{ background: 'rgba(15, 13, 26, 0.6)' }}>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          <HiTag className="inline mr-1" />
          Have a coupon or referral code?
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-lg" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <div className="flex items-center gap-2">
              <HiCheck className="text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">{appliedCoupon.code}</span>
              <span className="text-emerald-400 text-xs">— ₹{appliedCoupon.discount} off</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1"
              id="remove-coupon-btn"
            >
              <HiX />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="input-field flex-1 !py-2.5 text-sm"
              id="coupon-input"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
              id="apply-coupon-btn"
              style={{
                background: couponCode.trim() ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: couponCode.trim() ? '#a5b4fc' : '#64748b',
                opacity: couponLoading ? 0.7 : 1,
              }}
            >
              {couponLoading ? '...' : 'Apply'}
            </button>
          </div>
        )}
      </div>

      {/* Price Display */}
      {appliedCoupon && (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <span className="text-slate-500 line-through text-sm">₹{price}</span>
          <span className="text-2xl font-bold text-emerald-400">₹{displayPrice}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
          }}>
            {appliedCoupon.discountType === 'percentage'
              ? `${appliedCoupon.discountValue}% OFF`
              : `₹${appliedCoupon.discountValue} OFF`}
          </span>
        </div>
      )}

      {/* Buy Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="gradient-btn w-full text-base"
        id="buy-course-btn"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <HiLightningBolt className="text-lg" />
            {displayPrice === 0 ? 'Unlock Free' : `Buy Now — ₹${displayPrice}`}
          </span>
        )}
      </button>
    </div>
  );
};

export default PaymentButton;
