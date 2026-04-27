const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateCertificate, downloadCertificate, getMyCertificates, verifyCertificate } = require('../controllers/certificateController');

// Public route — anyone can verify
router.get('/verify/:certId', verifyCertificate);

// Protected routes
router.post('/generate/:courseId', protect, generateCertificate);
router.get('/download/:certId', protect, downloadCertificate);
router.get('/my-certificates', protect, getMyCertificates);

module.exports = router;
