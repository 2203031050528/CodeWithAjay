const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Video = require('../models/Video');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create or reset admin user
    const adminExists = await User.findOne({ email: 'admin@codewithajay.com' }).select('+password');
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@codewithajay.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@codewithajay.com / admin123');
    } else {
      // Reset password (in case it was corrupted or changed)
      adminExists.password = 'admin123';
      adminExists.role = 'admin';
      await adminExists.save(); // This triggers the pre-save bcrypt hook
      console.log('✅ Admin user password reset: admin@codewithajay.com / admin123');
    }

    // Create sample course
    const courseExists = await Course.findOne({ title: 'Complete Web Development Bootcamp' });
    if (!courseExists) {
      const course = await Course.create({
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and more. Build 10+ real-world projects from scratch. Go from zero to full-stack developer with this comprehensive course.',
        price: 249,
        thumbnail: '',
      });

      // Sample videos (using public YouTube videos for demo)
      const videos = [
        { title: 'Introduction to Web Development', youtubeUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 15, order: 1 },
        { title: 'HTML Fundamentals', youtubeUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 30, order: 2 },
        { title: 'CSS Styling & Layouts', youtubeUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 45, order: 3 },
        { title: 'JavaScript Basics', youtubeUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 60, order: 4 },
        { title: 'React.js Getting Started', youtubeUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 40, order: 5 },
      ];

      const videoIds = [];
      for (const v of videos) {
        const video = await Video.create({ ...v, course: course._id });
        videoIds.push(video._id);
      }

      course.videos = videoIds;
      await course.save();

      console.log('✅ Sample course created with 5 videos');
    } else {
      console.log('ℹ️  Sample course already exists');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
