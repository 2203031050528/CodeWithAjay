const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'https://code-with-ajay.vercel.app',
    'http://localhost:5173'
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/coupons', require('./routes/couponRoutes'));
// === New feature routes ===
app.use('/api/ai', require('./routes/ai'));
app.use('/api/coding', require('./routes/coding'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/certificates', require('./routes/certificate'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeWithAjay API is running 🚀' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
