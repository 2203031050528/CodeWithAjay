const PDFDocument = require('pdfkit');
const crypto = require('crypto');

const generateCertificateId = () => {
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CWA-${randomPart}`;
};

const generatePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margins: { top: 50, bottom: 50, left: 60, right: 60 } });
      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const width = doc.page.width;
      const height = doc.page.height;
      const centerX = width / 2;

      // Background
      doc.rect(0, 0, width, height).fill('#0F0D1A');
      // Borders
      doc.rect(30, 30, width - 60, height - 60).lineWidth(2).stroke('#6366F1');
      doc.rect(40, 40, width - 80, height - 80).lineWidth(0.5).stroke('#4338CA');
      // Top line
      doc.rect(60, 70, width - 120, 3).fill('#6366F1');

      // Header
      doc.fontSize(14).fillColor('#818CF8').font('Helvetica').text('CODEWITHAJAY', 0, 90, { align: 'center', width });
      doc.fontSize(36).fillColor('#FFFFFF').font('Helvetica-Bold').text('Certificate of Completion', 0, 115, { align: 'center', width });
      doc.rect(centerX - 60, 165, 120, 2).fill('#06B6D4');

      // Body
      doc.fontSize(13).fillColor('#94A3B8').font('Helvetica').text('This is to certify that', 0, 185, { align: 'center', width });
      doc.fontSize(32).fillColor('#A5B4FC').font('Helvetica-Bold').text(data.userName, 0, 210, { align: 'center', width });
      const nameW = doc.widthOfString(data.userName);
      doc.rect(centerX - nameW / 2, 248, nameW, 1).fill('#4338CA');
      doc.fontSize(13).fillColor('#94A3B8').font('Helvetica').text('has successfully completed the course', 0, 265, { align: 'center', width });
      doc.fontSize(24).fillColor('#06B6D4').font('Helvetica-Bold').text(`"${data.courseName}"`, 0, 290, { align: 'center', width });

      const fmtDate = new Date(data.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.fontSize(12).fillColor('#64748B').font('Helvetica').text(`Completed on ${fmtDate}`, 0, 330, { align: 'center', width });

      // Footer
      doc.fontSize(10).fillColor('#475569').font('Helvetica').text(`Certificate ID: ${data.certificateId}`, 60, height - 100, { width: 250 });
      const verifyUrl = `${process.env.CLIENT_URL || 'https://codewithajay.com'}/verify/${data.certificateId}`;
      doc.fontSize(9).fillColor('#6366F1').text(`Verify: ${verifyUrl}`, 60, height - 85, { width: 350 });

      // Signature
      doc.rect(width - 260, height - 110, 180, 1).fill('#4338CA');
      doc.fontSize(12).fillColor('#FFFFFF').font('Helvetica-Bold').text('Ajay', width - 260, height - 105, { align: 'center', width: 180 });
      doc.fontSize(9).fillColor('#94A3B8').font('Helvetica').text('Founder, CodeWithAjay', width - 260, height - 90, { align: 'center', width: 180 });
      doc.rect(60, height - 70, width - 120, 3).fill('#6366F1');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateCertificateId, generatePDF };
