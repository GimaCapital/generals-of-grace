// // backend/src/controllers/givingController.js
// const Giving = require('../models/Giving');
// const User = require('../models/User');
// const paymentService = require('../services/paymentService');
// const { sendEmail } = require('../services/emailService');
// const { generateReceipt } = require('../services/receiptService');
// const { logger } = require('../utils/logger');

// // ============================================
// // ✅ PAYMENT PROVIDER FUNCTIONS
// // ============================================

// /**
//  * Get current payment provider
//  */
// exports.getPaymentProvider = async (req, res) => {
//   try {
//     const provider = await paymentService.getProvider();
//     res.json({
//       success: true,
//       provider: provider,
//     });
//   } catch (error) {
//     // logger.error('Error getting payment provider:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error getting payment provider',
//     });
//   }
// };

// /**
//  * Switch payment provider (Admin only)
//  */
// exports.switchPaymentProvider = async (req, res) => {
//   try {
//     const { provider } = req.body;

//     if (!provider || (provider !== 'paystack' && provider !== 'flutterwave')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid provider. Must be "paystack" or "flutterwave"',
//       });
//     }

//     const success = await paymentService.setProvider(provider);
    
//     if (!success) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to switch payment provider',
//       });
//     }
    
//     res.json({
//       success: true,
//       provider: provider,
//       message: `Payment provider switched to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
//     });
    
//   } catch (error) {
//     // logger.error('Error switching payment provider:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error switching payment provider',
//     });
//   }
// };

// // ============================================
// // PAYMENT FUNCTIONS
// // ============================================

// /**
//  * Initialize payment
//  */
// exports.initializePayment = async (req, res) => {
//   try {
//     const { amount, type, currency = 'NGN', customTypeName } = req.body;
//     const userId = req.user.uid;

//     if (!amount || amount < 100) {
//       return res.status(400).json({
//         success: false,
//         message: 'Amount must be at least ₦100',
//       });
//     }

//     if (!type) {
//       return res.status(400).json({
//         success: false,
//         message: 'Giving type is required',
//       });
//     }

//     const user = await User.getById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     const reference = `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
//     const currentProvider = await paymentService.getProvider();

//     const giving = await Giving.create({
//       userId,
//       amount,
//       type,
//       customTypeName: customTypeName || '',
//       currency,
//       email: user.email,
//       titheNumber: user.titheNumber,
//       reference: reference,
//       ip: req.ip,
//       userAgent: req.get('user-agent'),
//       provider: currentProvider,
//       // ✅ REMOVED: paymentMethod (duplicate)
//     });

//     const payment = await paymentService.initializePayment({
//       amount,
//       currency,
//       email: user.email,
//       name: user.displayName,
//       phone: user.phoneNumber,
//       reference: reference,
//       titheNumber: user.titheNumber,
//       type,
//     });

//     const actualProvider = payment.provider || currentProvider;

//     const updateData = {
//       provider: actualProvider,
//       // ✅ REMOVED: paymentMethod (duplicate)
//     };

//     if (actualProvider === 'paystack') {
//       updateData.paystackRef = payment.data.reference || reference;
//       // ✅ REMOVED: paymentReference (duplicate)
//       updateData.paymentLink = payment.data.authorization_url;
//     } else {
//       // Flutterwave's /payments response does not reliably echo tx_ref,
//       // so fall back to the reference we generated and sent.
//       updateData.flutterwaveRef = payment.data.tx_ref || reference;
//       // ✅ REMOVED: paymentReference (duplicate)
//       updateData.paymentLink = payment.data.link;
//     }

//     await Giving.update(giving.id, updateData);

//     // logger.info(`💰 Payment initialized: ${reference} using ${actualProvider}`);

//     const responseData = {
//       authorization_url: payment.data.link || payment.data.authorization_url,
//       reference: reference,
//       titheNumber: user.titheNumber,
//       provider: actualProvider,
//     };

//     if (actualProvider === 'paystack') {
//       responseData.access_code = payment.data.access_code;
//     }

//     res.json({
//       success: true,
//       data: responseData,
//     });
//   } catch (error) {
//     // logger.error('Payment initialization error:', error);
//     console.error('❌ Error details:', error.message);
    
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Payment initialization failed',
//     });
//   }
// };

// /**
//  * Verify payment webhook (supports both providers)
//  */
// exports.webhook = async (req, res) => {
//   try {
//     const { event, data } = req.body;
//     const signature = req.headers['verif-hash'] || req.headers['x-paystack-signature'];

//     let provider = 'flutterwave';
//     let reference = data?.tx_ref || data?.reference;

//     if (signature && req.headers['x-paystack-signature']) {
//       provider = 'paystack';
//       const crypto = require('crypto');
//       const hash = crypto
//         .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
//         .update(JSON.stringify(req.body))
//         .digest('hex');

//       if (hash !== signature) {
//         logger.warn('Invalid Paystack webhook signature');
//         return res.status(401).json({ success: false, message: 'Invalid signature' });
//       }
//     } else if (signature && req.headers['verif-hash']) {
//       provider = 'flutterwave';
//       if (signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
//         logger.warn('Invalid Flutterwave webhook signature');
//         return res.status(401).json({ success: false, message: 'Invalid signature' });
//       }
//     }

//     if (provider === 'paystack' && event === 'charge.success') {
//       const { reference, amount, currency, customer, metadata } = data;

//       const giving = await Giving.findByAnyReference(reference);
//       if (!giving) {
//         logger.warn(`Giving record not found for ref: ${reference}`);
//         return res.status(200).json({ success: false, message: 'Record not found' });
//       }
//       logger.info(`✅ Giving record found: ${giving.reference} (status: ${giving.status})`);

//       if (data.status === 'success') {
//         await Giving.markSuccessful(giving.id, {
//           ...data,
//           provider: provider,
//         });
//         await User.updateTotalGiven(giving.userId, giving.amount);
//         // ✅ REMOVED: paymentMethod update (duplicate)

//         const receiptUrl = await generateReceipt({
//           ...giving,
//           reference: reference,
//           amount: amount || giving.amount,
//           currency: currency || giving.currency || 'NGN',
//           provider: provider,
//         });

//         await Giving.update(giving.id, { receiptUrl });

//         await sendEmail({
//           to: customer?.email || giving.email,
//           template: 'receipt',
//           data: {
//             ...giving,
//             reference: reference,
//             receiptUrl,
//             amount: amount || giving.amount,
//             currency: currency || giving.currency || 'NGN',
//             provider: provider,
//           },
//         });

//         logger.info(`✅ Paystack payment successful: ${reference}`);
//       } else {
//         await Giving.markFailed(giving.id, data?.gateway_response || 'Payment failed');
//         logger.warn(`❌ Paystack payment failed: ${reference}`);
//       }
//     } else if (provider === 'flutterwave' && event === 'charge.completed') {
//       const { tx_ref, status, amount, currency, customer } = data;

//       const giving = await Giving.findByAnyReference(tx_ref);
//       if (!giving) {
//         logger.warn(`Giving record not found for ref: ${tx_ref}`);
//         return res.status(200).json({ success: false, message: 'Record not found' });
//       }
//       logger.info(`✅ Giving record found: ${giving.reference} (status: ${giving.status})`);

//       if (status === 'successful') {
//         await Giving.markSuccessful(giving.id, {
//           ...data,
//           provider: provider,
//         });
//         await User.updateTotalGiven(giving.userId, giving.amount);
//         // ✅ REMOVED: paymentMethod update (duplicate)

//         const receiptUrl = await generateReceipt({
//           ...giving,
//           reference: giving.reference || tx_ref,
//           amount: amount || giving.amount,
//           currency: currency || giving.currency || 'NGN',
//           provider: provider,
//         });

//         await Giving.update(giving.id, { receiptUrl });

//         await sendEmail({
//           to: customer?.email || giving.email,
//           template: 'receipt',
//           data: {
//             ...giving,
//             reference: giving.reference || tx_ref,
//             receiptUrl,
//             amount: amount || giving.amount,
//             currency: currency || giving.currency || 'NGN',
//             provider: provider,
//           },
//         });

//         logger.info(`✅ Flutterwave payment successful: ${giving.reference}`);
//       } else {
//         await Giving.markFailed(giving.id, data?.failure_reason || 'Payment failed');
//         logger.warn(`❌ Flutterwave payment failed: ${giving.reference}`);
//       }
//     }

//     res.sendStatus(200);
//   } catch (error) {
//     logger.error('Webhook processing error:', error);
//     res.status(500).json({ success: false, message: 'Webhook processing failed' });
//   }
// };

// /**
//  * Get giving history - Admins see ALL, users see their own
//  */
// exports.getHistory = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const { page = 1, limit = 20 } = req.query;
    
//     const user = await User.getById(userId);
//     let history;
    
//     if (user?.role === 'admin') {
//       history = await Giving.getAllGiving(parseInt(page), parseInt(limit));
//     } else {
//       history = await Giving.getByUserId(userId, parseInt(page), parseInt(limit));
//     }
    
//     res.json({
//       success: true,
//       data: history.data,
//       pagination: history.pagination,
//     });
//   } catch (error) {
//     // logger.error('Get history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching giving history',
//     });
//   }
// };

// /**
//  * Get giving stats - Admins see ALL, users see their own
//  */
// exports.getStats = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const { year } = req.query;
    
//     const user = await User.getById(userId);
//     let stats;
    
//     if (user?.role === 'admin') {
//       stats = await Giving.getAllStats(year ? parseInt(year) : null);
//     } else {
//       stats = await Giving.getStats(year ? parseInt(year) : null);
//     }
    
//     res.json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     // logger.error('Get stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching giving stats',
//     });
//   }
// };

// /**
//  * Get single transaction
//  */
// exports.getTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.uid;
//     const user = await User.getById(userId);

//     const transaction = await Giving.getById(id);
//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found',
//       });
//     }

//     if (transaction.userId !== userId && user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized to view this transaction',
//       });
//     }

//     res.json({
//       success: true,
//       data: transaction,
//     });
//   } catch (error) {
//     // logger.error('Get transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching transaction',
//     });
//   }
// };

// /**
//  * Generate receipt for transaction
//  */
// exports.generateReceipt = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.uid;
//     const user = await User.getById(userId);

//     const transaction = await Giving.getById(id);
//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found',
//       });
//     }

//     if (transaction.userId !== userId && user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized to view this transaction',
//       });
//     }

//     const receiptUrl = await generateReceipt(transaction);

//     if (!transaction.receiptUrl) {
//       await Giving.update(id, { receiptUrl });
//     }

//     res.json({
//       success: true,
//       data: {
//         receiptUrl: receiptUrl || transaction.receiptUrl,
//       },
//     });
//   } catch (error) {
//     // logger.error('Generate receipt error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating receipt',
//     });
//   }
// };


// exports.getByReference = async (req, res) => {
//   try {
//     const { reference } = req.params;
    
//     // Use the enhanced method
//     const donation = await Giving.getByReference(reference);
    
//     if (!donation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Donation not found'
//       });
//     }
    
//     return res.status(200).json({
//       success: true,
//       data: donation
//     });
//   } catch (error) {
//     console.error('Error fetching donation:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch donation details'
//     });
//   }
// };

// /**
//  * Get user total giving
//  */
// exports.getUserTotal = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const total = await Giving.getUserTotal(userId);

//     res.json({
//       success: true,
//       data: {
//         total,
//       },
//     });
//   } catch (error) {
//     // logger.error('Get user total error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching total giving',
//     });
//   }
// };

// backend/src/controllers/givingController.js
const Giving = require('../models/Giving');
const User = require('../models/User');
const paymentService = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');
const { generateReceipt } = require('../services/receiptService');
const { logger } = require('../utils/logger');

// ============================================
// PAYMENT PROVIDER FUNCTIONS
// ============================================

exports.getPaymentProvider = async (req, res) => {
  try {
    const provider = await paymentService.getProvider();
    res.json({
      success: true,
      provider: provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting payment provider',
    });
  }
};

exports.switchPaymentProvider = async (req, res) => {
  try {
    const { provider } = req.body;

    if (!provider || (provider !== 'paystack' && provider !== 'flutterwave')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider. Must be "paystack" or "flutterwave"',
      });
    }

    const success = await paymentService.setProvider(provider);

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to switch payment provider',
      });
    }

    res.json({
      success: true,
      provider: provider,
      message: `Payment provider switched to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error switching payment provider',
    });
  }
};

// ============================================
// PAYMENT FUNCTIONS
// ============================================

exports.initializePayment = async (req, res) => {
  try {
    const { amount, type, currency = 'NGN', customTypeName } = req.body;
    const userId = req.user.uid;

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

    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const reference = `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const currentProvider = await paymentService.getProvider();

    const giving = await Giving.create({
      userId,
      amount,
      type,
      customTypeName: customTypeName || '',
      currency,
      email: user.email,
      titheNumber: user.titheNumber,
      reference: reference,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      provider: currentProvider,
    });

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

    const actualProvider = payment.provider || currentProvider;

    const updateData = {
      provider: actualProvider,
    };

    if (actualProvider === 'paystack') {
      updateData.paystackRef = payment.data.reference || reference;
      updateData.paymentLink = payment.data.authorization_url;
    } else {
      updateData.flutterwaveRef = payment.data.tx_ref || reference;
      updateData.paymentLink = payment.data.link;
    }

    await Giving.update(giving.id, updateData);

    const responseData = {
      authorization_url: payment.data.link || payment.data.authorization_url,
      reference: reference,
      titheNumber: user.titheNumber,
      provider: actualProvider,
    };

    if (actualProvider === 'paystack') {
      responseData.access_code = payment.data.access_code;
    }

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('❌ Error details:', error.message);

    res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed',
    });
  }
};

// ============================================
// VERIFY PAYMENT (frontend fallback)
// Called by GiveSuccess.jsx when user returns from payment
// Handles BOTH Paystack and Flutterwave
// ============================================
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Reference is required',
      });
    }

    // 1. Find the giving record
    const giving = await Giving.findByAnyReference(reference);
    if (!giving) {
      return res.status(404).json({
        success: false,
        message: 'Giving record not found',
      });
    }

    // 2. If already successful, return it (idempotent)
    if (giving.status === 'successful') {
      return res.json({
        success: true,
        data: giving,
      });
    }

    // 3. Determine which provider was used for THIS giving record
    //    (not the settings — the actual provider of this transaction)
    const provider = giving.provider || giving.paymentMethod || 'paystack';
    let verification;

    try {
      if (provider === 'paystack') {
        verification = await paymentService.verifyPaystack(reference);
      } else {
        verification = await paymentService.verifyFlutterwave(reference);
      }
    } catch (err) {
      console.error('Provider verification failed:', err.message);
      return res.status(502).json({
        success: false,
        message: 'Could not verify payment with provider',
        error: err.message,
      });
    }

    // 4. Update Firestore based on provider response
    await Giving.markSuccessfulFromVerification(giving.id, verification.data, provider);

    // 5. If success, update user total + generate receipt
    const isSuccess = provider === 'paystack'
      ? verification.data.status === 'success'
      : verification.data.status === 'successful';

    if (isSuccess && giving.userId && giving.amount) {
      try {
        await User.updateTotalGiven(giving.userId, giving.amount);
      } catch (err) {
        console.error('Failed to update user total:', err.message);
      }

      try {
        const receiptUrl = await generateReceipt({
          ...giving,
          ...verification.data,
          status: 'successful',
          provider,
        });
        if (receiptUrl) {
          await Giving.update(giving.id, { receiptUrl });
        }
      } catch (err) {
        console.error('Receipt generation failed:', err.message);
      }
    }

    // 6. Return updated record
    const updated = await Giving.getById(giving.id);

    return res.json({
      success: true,
      data: updated,
      provider,
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
    });
  }
};

// ============================================
// HISTORY / STATS / TRANSACTION
// ============================================

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.getById(userId);
    let history;

    if (user?.role === 'admin') {
      history = await Giving.getAllGiving(parseInt(page), parseInt(limit));
    } else {
      history = await Giving.getByUserId(userId, parseInt(page), parseInt(limit));
    }

    res.json({
      success: true,
      data: history.data,
      pagination: history.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching giving history',
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { year } = req.query;

    const user = await User.getById(userId);
    let stats;

    if (user?.role === 'admin') {
      stats = await Giving.getAllStats(year ? parseInt(year) : null);
    } else {
      stats = await Giving.getStats(year ? parseInt(year) : null);
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching giving stats',
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
    });
  }
};

exports.getByReference = async (req, res) => {
  try {
    const { reference } = req.params;

    const donation = await Giving.getByReference(reference);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donation details'
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: 'Error fetching total giving',
    });
  }
};