// // backend\src\routes\giving.js
// const express = require('express');
// const router = express.Router();
// const { authenticateUser, requireAdmin } = require('../middleware/auth');
// const { validateGiving } = require('../middleware/validation');
// const givingController = require('../controllers/givingController');

// // Public webhook (no auth)
// router.post('/webhook', givingController.webhook);

// // ============================================
// // ✅ PAYMENT PROVIDER ROUTES (Admin only)
// // ============================================
// router.get('/provider', authenticateUser, requireAdmin, givingController.getPaymentProvider);
// router.post('/provider', authenticateUser, requireAdmin, givingController.switchPaymentProvider);

// // Protected routes
// router.post('/initialize', authenticateUser, validateGiving, givingController.initializePayment);
// router.get('/history', authenticateUser, givingController.getHistory);
// router.get('/stats', authenticateUser, requireAdmin, givingController.getStats);
// router.get('/user-total', authenticateUser, givingController.getUserTotal);
// router.get('/transaction/:id', authenticateUser, givingController.getTransaction);
// router.get('/receipt/:id', authenticateUser, givingController.generateReceipt);
// router.get('/reference/:reference', givingController.getByReference);

// module.exports = router;

// backend/src/routes/giving.js
const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { validateGiving } = require('../middleware/validation');
const givingController = require('../controllers/givingController');

// ============================================
// PAYMENT PROVIDER ROUTES (Admin only)
// ============================================
router.get('/provider', authenticateUser, requireAdmin, givingController.getPaymentProvider);
router.post('/provider', authenticateUser, requireAdmin, givingController.switchPaymentProvider);

// ============================================
// PAYMENT ROUTES
// ============================================
router.post('/initialize', authenticateUser, validateGiving, givingController.initializePayment);

// ✅ Verify payment directly with provider (fallback when webhook fails)
// Handles BOTH Paystack and Flutterwave based on the giving record's provider field.
// MUST be before /reference/:reference
router.get('/verify-payment/:reference', givingController.verifyPayment);

// ============================================
// HISTORY / STATS / TRANSACTION
// ============================================
router.get('/history', authenticateUser, givingController.getHistory);
router.get('/stats', authenticateUser, requireAdmin, givingController.getStats);
router.get('/user-total', authenticateUser, givingController.getUserTotal);
router.get('/transaction/:id', authenticateUser, givingController.getTransaction);
router.get('/receipt/:id', authenticateUser, givingController.generateReceipt);
router.get('/reference/:reference', givingController.getByReference);

module.exports = router;