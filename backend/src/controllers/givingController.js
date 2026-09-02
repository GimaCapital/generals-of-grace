// backend/src/controllers/givingController.js
const Giving = require('../models/Giving');
const User = require('../models/User');
const paymentService = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');
const { generateReceipt } = require('../services/receiptService');
const { logger } = require('../utils/logger');

/**
 * Initialize payment
 */
exports.initializePayment = async (req, res) => {
  try {
    const { amount, type, currency = 'NGN' } = req.body;
    const userId = req.user.uid;

    // ✅ Validate required fields
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₦100',
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Giving type is required',
      });
    }

    // ✅ Get user from database
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ✅ Generate reference BEFORE creating giving record
    const reference = `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // ✅ Create giving record with the generated reference
    const giving = await Giving.create({
      userId,
      amount,
      type,
      currency,
      email: user.email,
      titheNumber: user.titheNumber,
      reference: reference,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // ✅ Log what we're sending
    logger.info(`📦 Initializing payment for ${user.email}: ${amount} ${currency}`);
    logger.info(`📦 Reference: ${reference}`);

    // ✅ Initialize payment with Flutterwave
    const payment = await paymentService.initializePayment({
      amount,
      currency,
      email: user.email,
      name: user.displayName,
      phone: user.phoneNumber,
      reference: reference,
      titheNumber: user.titheNumber,
      type,
    });

    // ✅ Update giving record with payment details
    await Giving.update(giving.id, {
      flutterwaveRef: payment.data.tx_ref,
      paymentLink: payment.data.link,
    });

    logger.info(`💰 Payment initialized: ${reference}`);
    
    res.json({
      success: true,
      data: {
        authorization_url: payment.data.link,
        reference: reference,
        titheNumber: user.titheNumber,
      },
    });
  } catch (error) {
    logger.error('Payment initialization error:', error);
    console.error('❌ Error details:', error.message);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed',
    });
  }
};

/**
 * Verify payment webhook
 */
exports.webhook = async (req, res) => {
  try {
    const { event, data } = req.body;
    const signature = req.headers['verif-hash'];

    if (signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
      logger.warn('Invalid webhook signature');
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    if (event === 'charge.completed') {
      const { tx_ref, status, amount, currency, customer } = data;

      const giving = await Giving.getByFlutterwaveRef(tx_ref);
      if (!giving) {
        logger.warn(`Giving record not found for ref: ${tx_ref}`);
        return res.status(404).json({ success: false, message: 'Record not found' });
      }

      if (status === 'successful') {
        await Giving.markSuccessful(giving.id, data);
        await User.updateTotalGiven(giving.userId, giving.amount);

        const receiptUrl = await generateReceipt({
          ...giving,
          reference: giving.reference || tx_ref,
          amount: amount || giving.amount,
          currency: currency || giving.currency || 'NGN',
        });

        await Giving.update(giving.id, { receiptUrl });

        await sendEmail({
          to: customer?.email || giving.email,
          template: 'receipt',
          data: {
            ...giving,
            reference: giving.reference || tx_ref,
            receiptUrl,
            amount: amount || giving.amount,
            currency: currency || giving.currency || 'NGN',
          },
        });

        logger.info(`✅ Payment successful: ${giving.reference}`);
      } else {
        await Giving.markFailed(giving.id, data?.failure_reason || 'Payment failed');
        logger.warn(`❌ Payment failed: ${giving.reference}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

/**
 * ✅ UPDATED: Get giving history - Admins see ALL, users see their own
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { page = 1, limit = 20 } = req.query;
    
    // ✅ Check if user is admin
    const user = await User.getById(userId);
    let history;
    
    if (user?.role === 'admin') {
      // ✅ Admin gets ALL giving records
      history = await Giving.getAllGiving(parseInt(page), parseInt(limit));
    } else {
      // ✅ Regular user gets only their records
      history = await Giving.getByUserId(userId, parseInt(page), parseInt(limit));
    }
    
    res.json({
      success: true,
      data: history.data,
      pagination: history.pagination,
    });
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching giving history',
    });
  }
};

/**
 * ✅ UPDATED: Get giving stats - Admins see ALL, users see their own
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { year } = req.query;
    
    // ✅ Check if user is admin
    const user = await User.getById(userId);
    let stats;
    
    if (user?.role === 'admin') {
      // ✅ Admin gets ALL giving stats
      stats = await Giving.getAllStats(year ? parseInt(year) : null);
    } else {
      // ✅ Regular user gets only their stats
      stats = await Giving.getStats(year ? parseInt(year) : null);
    }
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching giving stats',
    });
  }
};

/**
 * Get single transaction
 */
exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const user = await User.getById(userId);

    const transaction = await Giving.getById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this transaction',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
    });
  }
};

/**
 * Generate receipt for transaction
 */
exports.generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const user = await User.getById(userId);

    const transaction = await Giving.getById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this transaction',
      });
    }

    const receiptUrl = await generateReceipt(transaction);

    if (!transaction.receiptUrl) {
      await Giving.update(id, { receiptUrl });
    }

    res.json({
      success: true,
      data: {
        receiptUrl: receiptUrl || transaction.receiptUrl,
      },
    });
  } catch (error) {
    logger.error('Generate receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
    });
  }
};

/**
 * Get user total giving
 */
exports.getUserTotal = async (req, res) => {
  try {
    const userId = req.user.uid;
    const total = await Giving.getUserTotal(userId);

    res.json({
      success: true,
      data: {
        total,
      },
    });
  } catch (error) {
    logger.error('Get user total error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching total giving',
    });
  }
};