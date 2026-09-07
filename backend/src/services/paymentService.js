// backend/src/services/paymentService.js
const axios = require('axios');
// const { logger } = require('../utils/logger');
const Settings = require('../models/Settings');

/**
 * Payment service supporting both Paystack and Flutterwave
 * ✅ NO MEMORY CACHE - Always reads from database
 */
class PaymentService {
  constructor() {
    this.logo = 'https://gogintlchurch.org/images/gog-new-logo.png';
  }

  /**
   * ✅ Get current provider - ALWAYS from database
   */
  async getProvider() {
    try {
      const settings = await Settings.get();
      const provider = settings.paymentProvider || 'flutterwave';
      // logger.info(`💳 Payment provider from database: ${provider}`);
      return provider;
    } catch (error) {
      // logger.error('❌ Error getting provider from database:', error.message);
      return 'flutterwave';
    }
  }

  /**
   * ✅ Set payment provider - ALWAYS saves to database
   */
  async setProvider(provider) {
    if (provider !== 'paystack' && provider !== 'flutterwave') {
      return false;
    }
    
    try {
      const settings = await Settings.get();
      await Settings.update({
        ...settings,
        paymentProvider: provider,
      });
      // logger.info(`💳 Payment provider saved to database: ${provider}`);
      return true;
    } catch (error) {
      // logger.error('❌ Failed to save provider to database:', error.message);
      return false;
    }
  }

  /**
   * Initialize payment with selected provider
   */
  async initializePayment(paymentData) {
    const { 
      amount, 
      currency = 'NGN', 
      email, 
      name, 
      phone, 
      reference, 
      titheNumber, 
      type 
    } = paymentData;

    if (!amount) throw new Error('Amount is required');
    if (!email) throw new Error('Email is required');
    if (!reference) throw new Error('Transaction reference is required');

    // ✅ Get provider from database
    const provider = await this.getProvider();

    // logger.info(`💳 Initializing payment: ${reference} - ${amount} ${currency} using ${provider}`);

    if (provider === 'paystack') {
      return this.initializePaystack(paymentData);
    } else {
      return this.initializeFlutterwave(paymentData);
    }
  }

  /**
   * Initialize Paystack payment
   */
  async initializePaystack(paymentData) {
    const { amount, email, reference, titheNumber, type } = paymentData;

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: Math.round(amount * 100),
          reference,
          callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/give/success`,
          metadata: {
            titheNumber,
            type,
            custom_fields: [
              { display_name: "Giving Type", variable_name: "giving_type", value: type },
              { display_name: "Tithe Number", variable_name: "tithe_number", value: titheNumber || 'N/A' }
            ]
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // logger.info(`💳 Paystack payment initialized for ${email}`);
      return {
        success: true,
        data: response.data.data,
        provider: 'paystack'
      };
    } catch (error) {
      const errorDetails = error.response?.data || error.message;
      // logger.error('Paystack payment error:', errorDetails);
      throw new Error(error.response?.data?.message || 'Paystack payment initialization failed');
    }
  }

  /**
   * Initialize Flutterwave payment
   */
  async initializeFlutterwave(paymentData) {
    const { amount, currency, email, name, phone, reference, titheNumber, type } = paymentData;

    try {
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: reference,
          amount,
          currency,
          redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/give/success`,
          payment_options: 'card,ussd,banktransfer,mobilemoney',
          meta: {
            titheNumber,
            type,
          },
          customer: {
            email,
            phonenumber: phone || '',
            name: name || 'Generals of Grace Member',
          },
          customizations: {
            title: 'Generals of Grace Intl Church',
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} Payment`,
            logo: this.logo,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // logger.info(`💳 Flutterwave payment initialized for ${email}`);
      return {
        success: true,
        data: response.data.data,
        provider: 'flutterwave'
      };
    } catch (error) {
      const errorDetails = error.response?.data || error.message;
      // logger.error('Flutterwave payment error:', errorDetails);
      throw new Error(error.response?.data?.message || 'Flutterwave payment initialization failed');
    }
  }

  /**
   * Verify payment with the selected provider
   */
  async verifyPayment(reference) {
    // logger.info(`🔍 Verifying payment: ${reference}`);
    const provider = await this.getProvider();

    if (provider === 'paystack') {
      return this.verifyPaystack(reference);
    } else {
      return this.verifyFlutterwave(reference);
    }
  }

  /**
   * Verify Paystack payment
   */
  async verifyPaystack(reference) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        provider: 'paystack'
      };
    } catch (error) {
      // logger.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Paystack verification failed');
    }
  }

  /**
   * Verify Flutterwave payment
   */
  async verifyFlutterwave(tx_ref) {
    try {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        provider: 'flutterwave'
      };
    } catch (error) {
      // logger.error('Flutterwave verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Flutterwave verification failed');
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(transactionId, amount, reason = 'Customer request') {
    try {
      const response = await axios.post(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/refund`,
        {
          amount,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // logger.info(`💰 Refund processed for transaction: ${transactionId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // logger.error('Refund error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Refund failed');
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId) {
    try {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // logger.error('Get transaction status error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get transaction status');
    }
  }
}

module.exports = new PaymentService();