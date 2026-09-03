// backend/src/routes/orders.js
const express = require('express');
const router = express.Router();
const { db, FieldValue } = require('../config/firebase');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const axios = require('axios');

// ============================================
// FLUTTERWAVE CONFIGURATION
// ============================================
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_ENCRYPTION_KEY = process.env.FLUTTERWAVE_ENCRYPTION_KEY;
const FLUTTERWAVE_API_URL = process.env.FLUTTERWAVE_API_URL || 'https://api.flutterwave.com/v3';

// ✅ ADD THIS - Backend URL for internal calls
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

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
// INITIALIZE FLUTTERWAVE PAYMENT
// ============================================
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

    // Validate required fields
    if (!amount || !email || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount, email, and order ID are required'
      });
    }

    // Prepare Flutterwave payment data
    const paymentData = {
      tx_ref: `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      amount: parseFloat(amount),
      currency: 'NGN',
      redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-confirmation/${orderId}`,
      payment_options: 'card,ussd,banktransfer',
      customer: {
        email: email,
        name: name || 'Customer',
        phonenumber: phone || '08000000000'
      },
      customizations: {
        title: 'Generals of Grace',
        description: description,
        logo: `${process.env.FRONTEND_URL}/images/general_grace_logo.jpg`
      },
      meta: {
        orderId: orderId
      }
    };

    // Make API call to Flutterwave
    const response = await axios.post(
      `${FLUTTERWAVE_API_URL}/payments`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === 'success') {
      // Save payment reference to order
      await db.collection('orders').doc(orderId).update({
        paymentReference: response.data.data.tx_ref,
        paymentLink: response.data.data.link,
        flutterwaveTransactionId: response.data.data.id,
        updatedAt: FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        data: {
          link: response.data.data.link,
          tx_ref: response.data.data.tx_ref,
          transactionId: response.data.data.id
        }
      });
    } else {
      throw new Error(response.data.message || 'Payment initialization failed');
    }

  } catch (error) {
    console.error('Error initializing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
});

// ============================================
// VERIFY FLUTTERWAVE PAYMENT
// ============================================
router.get('/verify-payment/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // Verify payment with Flutterwave
    const response = await axios.get(
      `${FLUTTERWAVE_API_URL}/transactions/verify_by_reference?tx_ref=${tx_ref}`,
      {
        headers: {
          'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`
        }
      }
    );

    if (response.data.status === 'success') {
      const paymentData = response.data.data;
      
      // Find order by payment reference
      const ordersSnapshot = await db.collection('orders')
        .where('paymentReference', '==', tx_ref)
        .get();

      if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        const orderId = orderDoc.id;

        // Update order with payment status
        await db.collection('orders').doc(orderId).update({
          paymentStatus: paymentData.status === 'successful' ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
          paymentResponse: paymentData,
          updatedAt: FieldValue.serverTimestamp(),
          status: paymentData.status === 'successful' ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING
        });

        res.json({
          success: true,
          data: {
            orderId,
            status: paymentData.status,
            paymentData
          }
        });
      } else {
        res.json({
          success: false,
          message: 'Order not found for this payment reference'
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// ============================================
// WEBHOOK - Flutterwave Callback
// ============================================
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (optional but recommended)
    const signature = req.headers['verif-hash'];
    if (signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Process webhook event
    if (event.event === 'charge.completed') {
      const { tx_ref, status, amount, customer } = event.data;

      // Find order by payment reference
      const ordersSnapshot = await db.collection('orders')
        .where('paymentReference', '==', tx_ref)
        .get();

      if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        const orderId = orderDoc.id;

        const updates = {
          paymentStatus: status === 'successful' ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
          paymentResponse: event.data,
          updatedAt: FieldValue.serverTimestamp()
        };

        if (status === 'successful') {
          updates.status = ORDER_STATUS.CONFIRMED;
        }

        await db.collection('orders').doc(orderId).update(updates);
      }
    }

    res.status(200).json({ status: 'success' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE ORDER (Supports Cash & Flutterwave)
// ============================================
router.post('/', async (req, res) => {
  try {
    const {
      // Customer Info
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      
      // Order Items
      items,
      
      // Payment
      paymentMethod,
      paymentReference,
      
      // Cash Payment Details
      cashPaymentDetails,
      
      // Additional Info
      notes,
      deliveryMethod,
      deliveryDate,
      
      // User ID (if authenticated)
      userId,
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, email, and at least one item'
      });
    }

    // Validate payment method
    if (!paymentMethod || ![PAYMENT_METHODS.FLUTTERWAVE, PAYMENT_METHODS.CASH, PAYMENT_METHODS.BANK_TRANSFER].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Choose flutterwave, cash, or bank_transfer'
      });
    }

    // For cash payments, require additional details
    if (paymentMethod === PAYMENT_METHODS.CASH && !cashPaymentDetails) {
      return res.status(400).json({
        success: false,
        message: 'Cash payment requires additional details'
      });
    }

    // Calculate totals
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

    // Calculate shipping and tax
    const shippingCost = calculateShipping(subtotal, items, deliveryMethod);
    const tax = calculateTax(subtotal);
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = generateOrderNumber();

    const orderData = {
      // Order Info
      orderNumber,
      orderType: req.body.orderType || 'general',
      
      // Customer Info
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || {},
      
      // Items
      items: processedItems,
      totalItems,
      totalQuantity,
      
      // Pricing
      subtotal,
      shippingCost,
      tax,
      total,
      currency: 'NGN',
      
      // Payment - Enhanced
      paymentMethod,
      paymentStatus: paymentMethod === PAYMENT_METHODS.CASH ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING,
      paymentReference: paymentReference || '',
      
      // Cash Payment Details
      cashPaymentDetails: paymentMethod === PAYMENT_METHODS.CASH ? {
        amountPaid: cashPaymentDetails?.amountPaid || total,
        amountDue: cashPaymentDetails?.amountDue || 0,
        paidBy: cashPaymentDetails?.paidBy || '',
        paymentDate: cashPaymentDetails?.paymentDate || new Date().toISOString(),
        receivedBy: cashPaymentDetails?.receivedBy || '',
        receiptNumber: cashPaymentDetails?.receiptNumber || '',
        notes: cashPaymentDetails?.notes || ''
      } : null,
      
      // Delivery
      deliveryMethod: deliveryMethod || 'pickup',
      deliveryDate: deliveryDate || null,
      deliveryStatus: 'pending',
      
      // Status
      status: paymentMethod === PAYMENT_METHODS.CASH ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
      
      // Additional Info
      notes: notes || '',
      
      // User
      userId: userId || req.user?.uid || null,
      
      // Timestamps
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      
      // Metadata
      metadata: {
        source: 'website',
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
      }
    };

    // Save to Firestore
    const docRef = await db.collection('orders').add(orderData);
    
    // Get the created order
    const orderSnapshot = await docRef.get();
    const order = { id: docRef.id, ...orderSnapshot.data() };

    // ✅ FIXED: Use BACKEND_URL instead of FRONTEND_URL
    let paymentLink = null;
    if (paymentMethod === PAYMENT_METHODS.FLUTTERWAVE) {
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
        console.error('Error initializing payment:', paymentError);
        // Order is still created, but payment link failed
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
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});

// ============================================
// GET ALL ORDERS (Admin Only)
// ============================================
router.get('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or staff only.'
      });
    }

    const { status, type, paymentMethod, startDate, endDate, limit = 50, offset = 0 } = req.query;

    let query = db.collection('orders');

    // Apply filters
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

    // Get total count
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
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// ============================================
// GET SINGLE ORDER
// ============================================
router.get('/:id', authenticateUser, async (req, res) => {
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

    // Check if user has permission
    if (req.user.role !== 'admin' && 
        req.user.role !== 'staff' && 
        order.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// ============================================
// GET USER ORDERS
// ============================================
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user has permission
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
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
});

// ============================================
// UPDATE ORDER STATUS (Admin Only)
// ============================================
router.put('/:id/status', authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin or staff
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
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// ============================================
// UPDATE CASH PAYMENT STATUS (Admin Only)
// ============================================
router.put('/:id/cash-payment', authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin or staff
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

    // Update cash payment details
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
    console.error('Error updating cash payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cash payment',
      error: error.message
    });
  }
});

// ============================================
// CANCEL ORDER
// ============================================
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

    // Check if user owns this order or is admin
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
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// ============================================
// GET ORDER STATS (Admin Only)
// ============================================
router.get('/stats/overview', authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin
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

    // Payment stats
    const cashOrders = orders.filter(o => o.paymentMethod === 'cash').length;
    const flutterwaveOrders = orders.filter(o => o.paymentMethod === 'flutterwave').length;
    const bankTransferOrders = orders.filter(o => o.paymentMethod === 'bank_transfer').length;

    const totalRevenue = orders
      .filter(o => o.status === 'completed' || o.status === 'shipped')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalCashReceived = orders
      .filter(o => o.paymentMethod === 'cash' && (o.status === 'completed' || o.status === 'shipped'))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalOnlinePayments = orders
      .filter(o => o.paymentMethod === 'flutterwave' && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const recentOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    // Orders by type
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
        bankTransferOrders,
        recentOrders,
        ordersByType
      }
    });

  } catch (error) {
    console.error('Error fetching order stats:', error);
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

// Generate order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `GOG${year}${month}${day}${random}`;
}

// Calculate shipping cost
function calculateShipping(subtotal, items, deliveryMethod) {
  if (deliveryMethod === 'pickup') return 0;
  if (deliveryMethod === 'digital') return 0;
  
  // Free shipping for orders above ₦50,000
  if (subtotal >= 50000) return 0;
  
  // Base shipping
  let shipping = 2000;
  
  // Add extra for heavy items
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
  if (totalWeight > 5) {
    shipping += 1000;
  }
  if (totalWeight > 10) {
    shipping += 2000;
  }
  
  return shipping;
}

// Calculate tax
function calculateTax(subtotal) {
  // 7.5% VAT for Nigeria
  return Math.round(subtotal * 0.075);
}

module.exports = router;