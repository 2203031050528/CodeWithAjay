import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiLightningBolt } from 'react-icons/hi';

const PaymentButton = ({ courseId, courseName, price, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order
      const { data: orderData } = await API.post('/payment/create-order', { courseId });

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
          Buy Now — ₹{price}
        </span>
      )}
    </button>
  );
};

export default PaymentButton;
