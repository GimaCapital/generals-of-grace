const axios = require('axios');
const { logger } = require('../utils/logger');

/**
 * Payment service for Flutterwave integration
 */
class PaymentService {
  /**
   * Initialize payment
   */
  async initializePayment(paymentData) {
    try {
      const {
        amount,
        currency = 'NGN',
        email,
        name,
        phone,
        reference,
        titheNumber,
        type,
      } = paymentData;

      // ✅ Validate required parameters
      if (!amount) {
        throw new Error('Amount is required');
      }
      if (!email) {
        throw new Error('Email is required');
      }
      if (!reference) {
        throw new Error('Transaction reference is required');
      }

      logger.info(`💳 Initializing payment: ${reference} - ${amount} ${currency}`);

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
            logo: 'https://generalsofgrace.org/logo.png',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`💳 Payment initialized for ${email}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      const errorDetails = error.response?.data || error.message;
      logger.error('Payment service error:', errorDetails);
      
      // ✅ Better error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Payment initialization failed');
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(tx_ref) {
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
      };
    } catch (error) {
      logger.error('Payment verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment verification failed');
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

      logger.info(`💰 Refund processed for transaction: ${transactionId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      logger.error('Refund error:', error.response?.data || error.message);
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
      logger.error('Get transaction status error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get transaction status');
    }
  }
}

module.exports = new PaymentService();