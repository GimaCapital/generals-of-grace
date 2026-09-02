const sgMail = require('@sendgrid/mail');
const { logger } = require('../utils/logger');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Email templates
 */
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to Generals of Grace Intl Church! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 20px;">
          <h1 style="color: #1B2A4A; margin: 0;">Generals of Grace Intl Church</h1>
          <p style="color: #666; margin: 5px 0;">Welcome to the family!</p>
        </div>
        <div style="padding: 20px 0;">
          <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${data.displayName}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6;">We are so excited to welcome you to the Generals of Grace family!</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 5px 0; color: #666;">Your Tithe Number</p>
            <h2 style="color: #C9A84C; margin: 5px 0; font-size: 28px;">${data.titheNumber}</h2>
          </div>
          <h3 style="color: #1B2A4A;">Get Connected:</h3>
          <ul style="font-size: 16px; line-height: 1.8;">
            <li>📖 Watch <a href="${process.env.FRONTEND_URL}/sermons" style="color: #C9A84C;">Sermons</a></li>
            <li>📅 Check our <a href="${process.env.FRONTEND_URL}/events" style="color: #C9A84C;">Events Calendar</a></li>
            <li>🙏 Join a <a href="${process.env.FRONTEND_URL}/ministries" style="color: #C9A84C;">Ministry</a></li>
            <li>💰 Give online at <a href="${process.env.FRONTEND_URL}/give" style="color: #C9A84C;">Our Giving Page</a></li>
          </ul>
          <p style="font-size: 16px; line-height: 1.6;">We look forward to growing together in grace!</p>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>Generals of Grace Intl Church</p>
          <p><a href="${process.env.FRONTEND_URL}" style="color: #C9A84C;">${process.env.FRONTEND_URL}</a></p>
        </div>
      </div>
    `,
  }),

  receipt: (data) => ({
    subject: 'Giving Receipt - Generals of Grace Intl Church',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 20px;">
          <h1 style="color: #1B2A4A; margin: 0;">Generals of Grace Intl Church</h1>
          <p style="color: #666; margin: 5px 0;">Giving Receipt</p>
        </div>
        <div style="padding: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Receipt Number</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.reference}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Tithe Number</strong></td>
              <td style="padding: 8px 0; text-align: right; font-family: monospace;">${data.titheNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Type</strong></td>
              <td style="padding: 8px 0; text-align: right; text-transform: capitalize;">${data.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Amount</strong></td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 18px;">${data.currency || '₦'}${data.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date</strong></td>
              <td style="padding: 8px 0; text-align: right;">${new Date(data.date).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status</strong></td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="color: #4CAF50; font-weight: bold;">✓ Successful</span>
              </td>
            </tr>
          </table>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${data.receiptUrl}" style="background-color: #C9A84C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              📄 Download Receipt PDF
            </a>
          </div>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>Thank you for your generous giving. God bless you!</p>
          <p><a href="${process.env.FRONTEND_URL}" style="color: #C9A84C;">${process.env.FRONTEND_URL}</a></p>
        </div>
      </div>
    `,
  }),

  password_reset: (data) => ({
    subject: 'Password Reset Request - Generals of Grace Intl Church',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 20px;">
          <h1 style="color: #1B2A4A; margin: 0;">Generals of Grace Intl Church</h1>
          <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
        </div>
        <div style="padding: 20px 0;">
          <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" style="background-color: #C9A84C; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">This link will expire in <strong>1 hour</strong>.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>Generals of Grace Intl Church</p>
          <p><a href="${process.env.FRONTEND_URL}" style="color: #C9A84C;">${process.env.FRONTEND_URL}</a></p>
        </div>
      </div>
    `,
  }),
};

/**
 * Send email using SendGrid
 */
const sendEmail = async ({ to, template, data }) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      logger.warn('SendGrid API key not configured. Email not sent.');
      return false;
    }

    if (!templates[template]) {
      logger.error(`Template "${template}" not found`);
      return false;
    }

    const emailTemplate = templates[template](data);
    
    const msg = {
      to,
      from: {
        email: process.env.EMAIL_FROM || 'noreply@generalsofgrace.org',
        name: 'Generals of Grace Intl Church',
      },
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    await sgMail.send(msg);
    logger.info(`📧 Email sent to ${to} (${template})`);
    return true;
  } catch (error) {
    logger.error('Email send error:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  templates,
};