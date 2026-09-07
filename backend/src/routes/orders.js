// backend/src/routes/orders.js
const express = require('express');
const router = express.Router();
const { db, FieldValue } = require('../config/firebase');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const axios = require('axios');
const crypto = require('crypto');
const Settings = require('../models/Settings');

// ============================================
// PAYMENT CONFIGURATION
// ============================================
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_API_URL = process.env.FLUTTERWAVE_API_URL || 'https://api.flutterwave.com/v3';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API_URL = process.env.PAYSTACK_API_URL || 'https://api.paystack.co';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================
// ORDER TYPES & CATEGORIES
// ============================================
const ORDER_TYPES = {
  BOOK: 'book',
  MERCH: 'merch',
  RESOURCE: 'resource',
  DVD: 'dvd',
  CD: 'cd',
  APPAREL: 'apparel',
  OTHER: 'other'
};

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

const PAYMENT_METHODS = {
  FLUTTERWAVE: 'flutterwave',
  PAYSTACK: 'paystack',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// ============================================
// HELPER: Get Current Payment Provider from Settings
// ============================================
async function getPaymentProvider() {
  try {
    const settings = await Settings.get();
    return settings.paymentProvider || 'flutterwave';
  } catch (error) {
    // console.warn('⚠️ Could not get payment provider from settings, using default:', error.message);
    return 'flutterwave';
  }
}

// ============================================
// ✅ PUBLIC ROUTES - PUT THESE FIRST
// ============================================

// ✅ 1. VERIFY PAYMENT - MUST BE BEFORE /:id
router.get('/verify-payment/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    // console.log('✅ VERIFY PAYMENT ROUTE HIT:', reference);

    const ordersSnapshot = await db.collection('orders')
      .where('paymentReference', '==', reference)
      .get();

    if (ordersSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderDoc = ordersSnapshot.docs[0];
    const orderId = orderDoc.id;
    const order = orderDoc.data();
    const provider = order.paymentProvider || await getPaymentProvider();

    let verificationResult;

    if (provider === 'paystack') {
      const response = await axios.get(
        `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
          }
        }
      );

      verificationResult = response.data;

      if (verificationResult.status && verificationResult.data.status === 'success') {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: PAYMENT_STATUS.PAID,
          paymentResponse: verificationResult.data,
          updatedAt: FieldValue.serverTimestamp(),
          status: ORDER_STATUS.CONFIRMED
        });
      } else {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: PAYMENT_STATUS.FAILED,
          paymentResponse: verificationResult.data,
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      const updatedOrder = await db.collection('orders').doc(orderId).get();
      const orderData = { id: orderId, ...updatedOrder.data() };

      // Remove sensitive data
      delete orderData.paymentResponse;
      delete orderData.paymentHistory;

      res.json({
        success: true,
        data: {
          order: orderData,
          payment: verificationResult.data,
          provider: 'paystack'
        }
      });
    } else {
      const response = await axios.get(
        `${FLUTTERWAVE_API_URL}/transactions/verify_by_reference?tx_ref=${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`
          }
        }
      );

      verificationResult = response.data;

      if (verificationResult.status === 'success') {
        const paymentData = verificationResult.data;
        
        await db.collection('orders').doc(orderId).update({
          paymentStatus: paymentData.status === 'successful' ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
          paymentResponse: paymentData,
          updatedAt: FieldValue.serverTimestamp(),
          status: paymentData.status === 'successful' ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING
        });
      }

      const updatedOrder = await db.collection('orders').doc(orderId).get();
      const orderData = { id: orderId, ...updatedOrder.data() };

      // Remove sensitive data
      delete orderData.paymentResponse;
      delete orderData.paymentHistory;

      res.json({
        success: true,
        data: {
          order: orderData,
          payment: verificationResult.data,
          provider: 'flutterwave'
        }
      });
    }

  } catch (error) {
    // console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// ✅ 2. WEBHOOK
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    const signature = req.headers['verif-hash'] || req.headers['x-paystack-signature'];

    let provider = 'flutterwave';
    if (req.headers['x-paystack-signature']) {
      provider = 'paystack';
    }

    // Verify signature
    if (provider === 'paystack') {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(body))
        .digest('hex');

      if (hash !== signature) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      if (signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    let reference;
    let status;
    let amount;
    let customer;
    let orderId;

    if (provider === 'paystack') {
      const { event, data } = body;
      if (event === 'charge.success') {
        reference = data.reference;
        status = data.status;
        amount = data.amount / 100;
        customer = data.customer;
        orderId = data.metadata?.orderId;
      }
    } else {
      const { event, data } = body;
      if (event === 'charge.completed') {
        reference = data.tx_ref;
        status = data.status;
        amount = data.amount;
        customer = data.customer;
        orderId = data.meta?.orderId;
      }
    }

    if (reference) {
      const ordersSnapshot = await db.collection('orders')
        .where('paymentReference', '==', reference)
        .get();

      if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        const orderId = orderDoc.id;

        const updates = {
          paymentStatus: status === 'successful' || status === 'success' ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
          paymentResponse: body.data,
          updatedAt: FieldValue.serverTimestamp(),
          paymentProvider: provider
        };

        if (status === 'successful' || status === 'success') {
          updates.status = ORDER_STATUS.CONFIRMED;
        }

        await db.collection('orders').doc(orderId).update(updates);
      }
    }

    res.status(200).json({ status: 'success' });

  } catch (error) {
    // console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 3. INITIALIZE PAYMENT
router.post('/initialize-payment', async (req, res) => {
  try {
    const { 
      amount, 
      email, 
      name, 
      phone, 
      orderId,
      description = 'Church Materials Purchase'
    } = req.body;

    if (!amount || !email || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount, email, and order ID are required'
      });
    }

    const provider = await getPaymentProvider();
    let paymentData;
    let response;

    if (provider === 'paystack') {
      // ✅ Paystack Payment
      const reference = `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      
      paymentData = {
        email: email,
        amount: Math.round(parseFloat(amount) * 100),
        reference: reference,
        callback_url: `${FRONTEND_URL}/order-confirmation/${orderId}`,
        metadata: {
          orderId: orderId,
          custom_fields: [
            { display_name: "Order ID", variable_name: "order_id", value: orderId },
            { display_name: "Customer Name", variable_name: "customer_name", value: name || 'Customer' }
          ]
        }
      };

      response = await axios.post(
        `${PAYSTACK_API_URL}/transaction/initialize`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        await db.collection('orders').doc(orderId).update({
          paymentReference: reference,
          paymentLink: response.data.data.authorization_url,
          paymentProvider: 'paystack',
          updatedAt: FieldValue.serverTimestamp()
        });

        res.json({
          success: true,
          data: {
            link: response.data.data.authorization_url,
            reference: reference,
            provider: 'paystack'
          }
        });
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    } else {
      // ✅ Flutterwave Payment - HOSTED PAGE
      // ✅ Generate tx_ref BEFORE sending (this is what we'll save)
      const tx_ref = `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      
      // console.log('✅ Generated tx_ref for Flutterwave:', tx_ref);
      
      paymentData = {
        tx_ref: tx_ref,
        amount: parseFloat(amount),
        currency: 'NGN',
        redirect_url: `${FRONTEND_URL}/order-confirmation/${orderId}`,
        payment_options: 'card,ussd,banktransfer',
        customer: {
          email: email,
          name: name || 'Customer',
          phonenumber: phone || '08000000000'
        },
        customizations: {
          title: 'Generals of Grace',
          description: description,
        },
        meta: {
          orderId: orderId
        }
      };

      // console.log('📤 Sending Flutterwave payment with tx_ref:', tx_ref);

      response = await axios.post(
        `${FLUTTERWAVE_API_URL}/payments`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // console.log('📥 Flutterwave response status:', response.data.status);

      if (response.data.status === 'success') {
        const paymentLink = response.data.data.link;
        
        // console.log('✅ Flutterwave payment link:', paymentLink);
        // console.log('✅ Saving paymentReference:', tx_ref);
        
        // ✅ Use the tx_ref WE generated (not from response)
        await db.collection('orders').doc(orderId).update({
          paymentReference: tx_ref,
          paymentLink: paymentLink,
          paymentProvider: 'flutterwave',
          updatedAt: FieldValue.serverTimestamp()
        });

        // ✅ Verify it was saved
        const checkOrder = await db.collection('orders').doc(orderId).get();
        // console.log('✅ Saved paymentReference:', checkOrder.data().paymentReference);
        // console.log('✅ Saved paymentLink:', checkOrder.data().paymentLink);

        res.json({
          success: true,
          data: {
            link: paymentLink,
            tx_ref: tx_ref,
            transactionId: response.data.data.id || 'N/A',
            provider: 'flutterwave'
          }
        });
      } else {
        // console.error('❌ Flutterwave error:', response.data);
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    }

  } catch (error) {
    // console.error('Error initializing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
});

// ✅ 4. CREATE ORDER
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      paymentMethod,
      paymentReference,
      cashPaymentDetails,
      notes,
      deliveryMethod,
      deliveryDate,
      userId,
    } = req.body;

    if (!customerName || !customerEmail || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, email, and at least one item'
      });
    }

    if (!paymentMethod || ![PAYMENT_METHODS.FLUTTERWAVE, PAYMENT_METHODS.PAYSTACK, PAYMENT_METHODS.CASH, PAYMENT_METHODS.BANK_TRANSFER].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Choose flutterwave, paystack, cash, or bank_transfer'
      });
    }

    if (paymentMethod === PAYMENT_METHODS.CASH && !cashPaymentDetails) {
      return res.status(400).json({
        success: false,
        message: 'Cash payment requires additional details'
      });
    }

    let subtotal = 0;
    let totalItems = 0;
    let totalQuantity = 0;

    const processedItems = items.map((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      totalItems++;
      totalQuantity += item.quantity;

      return {
        id: item.id || item.itemId,
        type: item.type || 'book',
        title: item.title,
        description: item.description || '',
        price: item.price,
        quantity: item.quantity,
        total: itemTotal,
        image: item.image || '',
        sku: item.sku || '',
        weight: item.weight || 0,
        dimensions: item.dimensions || {},
        options: item.options || {}
      };
    });

    const shippingCost = calculateShipping(subtotal, items, deliveryMethod);
    const tax = calculateTax(subtotal);
    const total = subtotal + shippingCost + tax;

    const orderNumber = generateOrderNumber();
    const provider = await getPaymentProvider();

    const orderData = {
      orderNumber,
      orderType: req.body.orderType || 'general',
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || {},
      items: processedItems,
      totalItems,
      totalQuantity,
      subtotal,
      shippingCost,
      tax,
      total,
      currency: 'NGN',
      paymentMethod: paymentMethod || PAYMENT_METHODS.FLUTTERWAVE,
      paymentStatus: paymentMethod === PAYMENT_METHODS.CASH ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING,
      paymentReference: paymentReference || '',
      paymentProvider: provider,
      cashPaymentDetails: paymentMethod === PAYMENT_METHODS.CASH ? {
        amountPaid: cashPaymentDetails?.amountPaid || total,
        amountDue: cashPaymentDetails?.amountDue || 0,
        paidBy: cashPaymentDetails?.paidBy || '',
        paymentDate: cashPaymentDetails?.paymentDate || new Date().toISOString(),
        receivedBy: cashPaymentDetails?.receivedBy || '',
        receiptNumber: cashPaymentDetails?.receiptNumber || '',
        notes: cashPaymentDetails?.notes || ''
      } : null,
      deliveryMethod: deliveryMethod || 'pickup',
      deliveryDate: deliveryDate || null,
      deliveryStatus: 'pending',
      status: paymentMethod === PAYMENT_METHODS.CASH ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
      notes: notes || '',
      userId: userId || req.user?.uid || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: {
        source: 'website',
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
      }
    };

    const docRef = await db.collection('orders').add(orderData);
    const orderSnapshot = await docRef.get();
    const order = { id: docRef.id, ...orderSnapshot.data() };

    let paymentLink = null;
    if (paymentMethod === PAYMENT_METHODS.FLUTTERWAVE || paymentMethod === PAYMENT_METHODS.PAYSTACK) {
      try {
        const paymentResponse = await axios.post(
          `${BACKEND_URL}/api/orders/initialize-payment`,
          {
            amount: total,
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            orderId: docRef.id,
            description: `Order ${orderNumber} - ${items.map(i => i.title).join(', ')}`
          }
        );

        if (paymentResponse.data.success) {
          paymentLink = paymentResponse.data.data.link;
        }
      } catch (paymentError) {
        // console.error('Error initializing payment:', paymentError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        order,
        paymentLink
      }
    });

  } catch (error) {
    // console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});

// ============================================
// ✅ PARAMETER ROUTES - PUT AFTER PUBLIC ROUTES
// ============================================

// ✅ 5. GET SINGLE ORDER
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('orders').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = { id: doc.id, ...doc.data() };

    // Remove sensitive data
    delete order.paymentResponse;
    delete order.paymentHistory;

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    // console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// ============================================
// ✅ AUTHENTICATED ROUTES - PUT LAST
// ============================================

// ✅ 6. GET USER ORDERS
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user.role !== 'admin' && req.user.uid !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const snapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    // console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
});

// ✅ 7. GET ALL ORDERS
router.get('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or staff only.'
      });
    }

    const { status, type, paymentMethod, startDate, endDate, limit = 50, offset = 0 } = req.query;

    let query = db.collection('orders');

    if (status) {
      query = query.where('status', '==', status);
    }
    if (type) {
      query = query.where('orderType', '==', type);
    }
    if (paymentMethod) {
      query = query.where('paymentMethod', '==', paymentMethod);
    }
    if (startDate) {
      query = query.where('createdAt', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('createdAt', '<=', new Date(endDate));
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    const totalSnapshot = await db.collection('orders').get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    // console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// ✅ 8. UPDATE ORDER STATUS
router.put('/:id/status', authenticateUser, requireAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or staff only.'
      });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || !ORDER_STATUS[status.toUpperCase()]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await db.collection('orders').doc(id).update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
      statusHistory: FieldValue.arrayUnion({
        status,
        date: new Date().toISOString(),
        updatedBy: req.user.email || 'admin',
        notes: notes || ''
      })
    });

    const doc = await db.collection('orders').doc(id).get();
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { id: doc.id, ...doc.data() }
    });

  } catch (error) {
    // console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// ✅ 9. UPDATE CASH PAYMENT
router.put('/:id/cash-payment', authenticateUser, requireAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or staff only.'
      });
    }

    const { id } = req.params;
    const { paymentStatus, amountPaid, paidBy, notes } = req.body;

    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = doc.data();

    await db.collection('orders').doc(id).update({
      paymentStatus,
      cashPaymentDetails: {
        ...order.cashPaymentDetails,
        amountPaid: amountPaid || order.cashPaymentDetails?.amountPaid || order.total,
        amountDue: Math.max(0, (order.cashPaymentDetails?.amountDue || 0) - (amountPaid || 0)),
        paidBy: paidBy || order.cashPaymentDetails?.paidBy || '',
        paymentDate: new Date().toISOString(),
        receivedBy: req.user.email || 'admin',
        notes: notes || ''
      },
      updatedAt: FieldValue.serverTimestamp(),
      paymentHistory: FieldValue.arrayUnion({
        type: 'cash',
        status: paymentStatus,
        amount: amountPaid || order.total,
        date: new Date().toISOString(),
        receivedBy: req.user.email || 'admin',
        notes: notes || ''
      })
    });

    const updatedDoc = await db.collection('orders').doc(id).get();
    res.json({
      success: true,
      message: 'Cash payment status updated successfully',
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    });

  } catch (error) {
    // console.error('Error updating cash payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cash payment',
      error: error.message
    });
  }
});

// ✅ 10. CANCEL ORDER
router.post('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const doc = await db.collection('orders').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = doc.data();

    if (req.user.uid !== order.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (order.status === 'shipped' || order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This order cannot be cancelled as it has already been shipped or completed.'
      });
    }

    await db.collection('orders').doc(id).update({
      status: 'cancelled',
      updatedAt: FieldValue.serverTimestamp(),
      cancellationReason: reason || 'Customer requested cancellation',
      cancelledAt: new Date().toISOString(),
      statusHistory: FieldValue.arrayUnion({
        status: 'cancelled',
        date: new Date().toISOString(),
        reason: reason || 'Customer requested cancellation',
        updatedBy: req.user.email || 'customer'
      })
    });

    const updatedDoc = await db.collection('orders').doc(id).get();
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    });

  } catch (error) {
    // console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// ✅ 11. GET ORDER STATS
router.get('/stats/overview', authenticateUser, requireAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const snapshot = await db.collection('orders').get();
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    const cashOrders = orders.filter(o => o.paymentMethod === 'cash').length;
    const flutterwaveOrders = orders.filter(o => o.paymentMethod === 'flutterwave').length;
    const paystackOrders = orders.filter(o => o.paymentMethod === 'paystack').length;
    const bankTransferOrders = orders.filter(o => o.paymentMethod === 'bank_transfer').length;

    const totalRevenue = orders
      .filter(o => o.status === 'completed' || o.status === 'shipped')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalCashReceived = orders
      .filter(o => o.paymentMethod === 'cash' && (o.status === 'completed' || o.status === 'shipped'))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalOnlinePayments = orders
      .filter(o => (o.paymentMethod === 'flutterwave' || o.paymentMethod === 'paystack') && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const recentOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    const ordersByType = {};
    orders.forEach(o => {
      const type = o.orderType || 'other';
      ordersByType[type] = (ordersByType[type] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        totalCashReceived,
        totalOnlinePayments,
        cashOrders,
        flutterwaveOrders,
        paystackOrders,
        bankTransferOrders,
        recentOrders,
        ordersByType
      }
    });

  } catch (error) {
    // console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order stats',
      error: error.message
    });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `GOG${year}${month}${day}${random}`;
}

function calculateShipping(subtotal, items, deliveryMethod) {
  if (deliveryMethod === 'pickup') return 0;
  if (deliveryMethod === 'digital') return 0;
  if (subtotal >= 50000) return 0;
  
  let shipping = 2000;
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
  if (totalWeight > 5) {
    shipping += 1000;
  }
  if (totalWeight > 10) {
    shipping += 2000;
  }
  return shipping;
}

function calculateTax(subtotal) {
  return Math.round(subtotal * 0.075);
}

module.exports = router;