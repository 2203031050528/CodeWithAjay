const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const Video = require('../models/Video');
const Course = require('../models/Course');
const { generateCertificateId, generatePDF } = require('../services/certificateService');
const { notifyCertificate } = require('../services/notificationService');

// @desc    Generate certificate for a completed course
// @route   POST /api/certificates/generate/:courseId
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if user has purchased the course
    if (!req.user.purchasedCourses.includes(courseId)) {
      return res.status(403).json({ success: false, message: 'You have not purchased this course' });
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ userId, courseId });
    if (existing) {
      return res.json({ success: true, data: existing, message: 'Certificate already generated' });
    }

    // Verify 100% completion
    const totalVideos = await Video.countDocuments({ course: courseId });
    const completedVideos = await Progress.countDocuments({ userId, courseId, completed: true });

    if (totalVideos === 0 || completedVideos < totalVideos) {
      return res.status(400).json({
        success: false,
        message: `Course not fully completed (${completedVideos}/${totalVideos} lessons done)`,
      });
    }

    const course = await Course.findById(courseId).select('title');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const certId = generateCertificateId();

    // Create certificate record
    const certificate = await Certificate.create({
      userId, courseId, certificateId: certId,
      userName: req.user.name, courseName: course.title,
      completionDate: new Date(),
    });

    // Send notification
    await notifyCertificate(userId, course.title, certId);

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download certificate PDF
// @route   GET /api/certificates/download/:certId
exports.downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certId });
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

    // Only owner can download
    if (certificate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const pdfBuffer = await generatePDF({
      userName: certificate.userName,
      courseName: certificate.courseName,
      certificateId: certificate.certificateId,
      completionDate: certificate.completionDate,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=CodeWithAjay_Certificate_${certificate.certificateId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's certificates
// @route   GET /api/certificates/my-certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify certificate (PUBLIC)
// @route   GET /api/certificates/verify/:certId
exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certId });
    if (!certificate) {
      return res.status(404).json({ success: false, verified: false, message: 'Certificate not found' });
    }
    res.json({
      success: true, verified: certificate.verified,
      data: {
        certificateId: certificate.certificateId,
        userName: certificate.userName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        issuedAt: certificate.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
