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
            receipt: 'receipt_69db1b9c246b309461078bca_69db2d6d5787696b26aeb217_1775972515000'
        };
        const order = await razorpayInstance.orders.create(options);
        console.log("Success");
    } catch (e) {
        console.error("Razorpay Error:", e);
    }
})();
