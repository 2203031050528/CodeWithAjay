require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Video = require('./models/Video');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Course.deleteMany({});
    await Video.deleteMany({});
    
    // Create new root course for AI Engineer
    await Course.create({
        title: 'Full AI Engineer Syllabus',
        description: 'Master Python, Machine Learning, Deep Learning, LLMs, RAG, AI Agents & more. One-time payment. Lifetime access. Start your AI career today.',
        price: 49,
        thumbnail: ''
    });

    console.log('Cleared and reset course data.');
    process.exit();
})();
