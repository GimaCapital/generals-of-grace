const PDFDocument = require('pdfkit');
const { storage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');

const generateReceipt = async (givingData) => {
  try {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    // Header
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#1B2A4A')
      .text('GENERALS OF GRACE INTL CHURCH', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#666666')
      .text('Giving Receipt', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#999999')
      .text('123 Church Road, Port Harcourt, Rivers State, Nigeria', { align: 'center' })
      .text('info@generalsofgrace.org | +234 800 000 0000', { align: 'center' })
      .moveDown(1);

    doc
      .strokeColor('#C9A84C')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1);

    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#333333');

    const date = givingData.date ? new Date(givingData.date) : new Date();
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const receiptNumber = givingData.reference || uuidv4().slice(0, 8).toUpperCase();
    const titheNumber = givingData.titheNumber || 'N/A';
    const type = givingData.type?.charAt(0).toUpperCase() + givingData.type?.slice(1) || 'N/A';
    const amount = givingData.amount?.toLocaleString() || '0';
    const currency = givingData.currency || '₦';

    let yPos = doc.y;

    doc
      .text('Receipt Number:', 50, yPos, { continued: true })
      .font('Helvetica-Bold')
      .text(` ${receiptNumber}`, { continued: false });

    yPos = doc.y;
    doc
      .text('Tithe Number:', 50, yPos, { continued: true })
      .font('Helvetica-Bold')
      .text(` ${titheNumber}`, { continued: false });

    yPos = doc.y;
    doc
      .text('Type:', 50, yPos, { continued: true })
      .font('Helvetica-Bold')
      .text(` ${type}`, { continued: false });

    yPos = doc.y;
    doc
      .text('Amount:', 50, yPos, { continued: true })
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor('#C9A84C')
      .text(` ${currency}${amount}`, { continued: false });

    doc.fillColor('#333333').fontSize(11);

    yPos = doc.y;
    doc
      .text('Date:', 300, yPos, { continued: true })
      .font('Helvetica-Bold')
      .text(` ${formattedDate}`, { continued: false });

    yPos = doc.y;
    doc
      .text('Status:', 300, yPos, { continued: true })
      .font('Helvetica-Bold')
      .fillColor('#4CAF50')
      .text(' ✓ SUCCESSFUL', { continued: false });

    doc.fillColor('#333333').moveDown(1);

    doc
      .strokeColor('#C9A84C')
      .lineWidth(1)
      .moveTo(50, doc.y + 10)
      .lineTo(550, doc.y + 10)
      .stroke()
      .moveDown(2);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#1B2A4A')
      .text('Thank you for your generous giving!', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#666666')
      .text('"God loves a cheerful giver." - 2 Corinthians 9:7', { align: 'center' })
      .moveDown(1);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#999999')
      .text('This is a computer-generated receipt. No signature required.', { align: 'center' })
      .moveDown(0.5)
      .text(process.env.FRONTEND_URL || 'https://generalsofgrace.org', { align: 'center' });

    doc.end();

    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    const buffer = Buffer.concat(chunks);
    const filename = `receipt-${receiptNumber}.pdf`;
    const filePath = `receipts/${filename}`;

    const file = storage.file(filePath);
    await file.save(buffer, {
      contentType: 'application/pdf',
      public: true,
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    logger.info(`📄 Receipt generated: ${filename}`);
    return url;
  } catch (error) {
    logger.error('Error generating receipt:', error);
    return null;
  }
};

module.exports = { generateReceipt };