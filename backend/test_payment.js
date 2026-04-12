require('dotenv').config();
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

(async () => {
    try {
        const options = {
            amount: 4900,
            currency: 'INR',
            receipt: `receipt_test_123`,
        };
        const order = await razorpayInstance.orders.create(options);
        console.log("Success:", order);
    } catch (e) {
        console.error("Razorpay Error:", e);
    }
})();
