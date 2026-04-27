require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Course = require('./backend/models/Course');
const Video = require('./backend/models/Video');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Course.deleteMany({});
    await Video.deleteMany({});
    
    // Create new root course for AI Engineer
    await Course.create({
        title: 'Full AI Engineer Syllabus',
        description: 'Master Python, Machine Learning, Deep Learning, LLMs, RAG, AI Agents & more. One-time payment. Lifetime access. Start your AI career today.',
        price: 249,
        thumbnail: ''
    });

    console.log('Cleared and reset course data.');
    process.exit();
})();
