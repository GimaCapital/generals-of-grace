// backend\src\routes\giving.js
const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { validateGiving } = require('../middleware/validation');
const givingController = require('../controllers/givingController');

// Public webhook (no auth)
router.post('/webhook', givingController.webhook);

// ============================================
// ✅ PAYMENT PROVIDER ROUTES (Admin only)
// ============================================
router.get('/provider', authenticateUser, requireAdmin, givingController.getPaymentProvider);
router.post('/provider', authenticateUser, requireAdmin, givingController.switchPaymentProvider);

// Protected routes
router.post('/initialize', authenticateUser, validateGiving, givingController.initializePayment);
router.get('/history', authenticateUser, givingController.getHistory);
router.get('/stats', authenticateUser, requireAdmin, givingController.getStats);
router.get('/user-total', authenticateUser, givingController.getUserTotal);
router.get('/transaction/:id', authenticateUser, givingController.getTransaction);
router.get('/receipt/:id', authenticateUser, givingController.generateReceipt);
router.get('/reference/:reference', givingController.getByReference);

module.exports = router;