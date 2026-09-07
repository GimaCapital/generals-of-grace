// backend/src/controllers/settingsController.js
const Settings = require('../models/Settings');
const PaymentService = require('../services/paymentService');
const { logger } = require('../utils/logger');

/**
 * ✅ Get settings - returns whatever is in the database
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    // ✅ Added await - reads from database
    const paymentProvider = await PaymentService.getProvider();
    
    res.json({
      success: true,
      data: {
        ...settings,
        paymentProvider: paymentProvider,
      },
    });
  } catch (error) {
    // logger.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
    });
  }
};

/**
 * ✅ Update settings - saves ALL fields including paymentProvider
 */
exports.updateSettings = async (req, res) => {
  try {
    const data = req.body;
    
    // ✅ Added await - saves to database
    if (data.paymentProvider && (data.paymentProvider === 'paystack' || data.paymentProvider === 'flutterwave')) {
      await PaymentService.setProvider(data.paymentProvider);
      // logger.info(`💳 Payment provider switched to: ${data.paymentProvider}`);
    }
    
    // ✅ Save ALL data - including paymentProvider!
    const settings = await Settings.update(data);
    
    // ✅ Added await - reads from database
    const currentProvider = await PaymentService.getProvider();
    
    res.json({
      success: true,
      data: {
        ...settings,
        paymentProvider: currentProvider,
      },
      message: 'Settings saved successfully!'
    });
  } catch (error) {
    // logger.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating settings',
    });
  }
};

/**
 * Get payment provider only
 */
exports.getPaymentProvider = async (req, res) => {
  try {
    // ✅ Added await - reads from database
    const provider = await PaymentService.getProvider();
    res.json({
      success: true,
      provider: provider,
    });
  } catch (error) {
    // logger.error('Error getting payment provider:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payment provider',
    });
  }
};

/**
 * Update payment provider only
 */
exports.updatePaymentProvider = async (req, res) => {
  try {
    const { provider } = req.body;
    
    if (!provider || (provider !== 'paystack' && provider !== 'flutterwave')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider. Must be "paystack" or "flutterwave"',
      });
    }
    
    // ✅ Added await - saves to database (PaymentService handles both memory and DB)
    const success = await PaymentService.setProvider(provider);
    if (success) {
      res.json({
        success: true,
        provider: provider,
        message: `Payment provider switched to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to switch payment provider',
      });
    }
  } catch (error) {
    // logger.error('Error updating payment provider:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating payment provider',
    });
  }
};