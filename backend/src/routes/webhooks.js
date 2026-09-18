// // backend/src/routes/webhooks.js
// const express = require('express');
// const router = express.Router();
// const crypto = require('crypto');
// const { db, FieldValue } = require('../config/firebase');
// const givingController = require('../controllers/givingController');
// const { logger } = require('../utils/logger');

// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH;

// // ============================================
// // HELPER: timing-safe string comparison
// // ============================================
// function safeEqual(a, b) {
//   if (typeof a !== 'string' || typeof b !== 'string') return false;
//   const bufA = Buffer.from(a);
//   const bufB = Buffer.from(b);
//   if (bufA.length !== bufB.length) return false;
//   return crypto.timingSafeEqual(bufA, bufB);
// }

// // ============================================
// // UNIFIED WEBHOOK HANDLER
// // Handles both Giving and Orders from Paystack & Flutterwave
// // ============================================
// router.post('/webhook', async (req, res) => {
//   try {
//     const body = req.body;
//     const paystackSignature = req.headers['x-paystack-signature'];
//     const flutterwaveSignature = req.headers['verif-hash'];

//     // ============================================
//     // STEP 1: Detect Provider
//     // ============================================
//     let provider = null;
//     if (paystackSignature) {
//       provider = 'paystack';
//     } else if (flutterwaveSignature) {
//       provider = 'flutterwave';
//     } else {
//       logger.warn('Webhook received with no signature');
//       return res.status(401).json({ message: 'No signature provided' });
//     }

//     // ============================================
//     // STEP 2: Verify Signature
//     // ============================================
//     if (provider === 'paystack') {
//       // Use raw body for HMAC — re-stringifying req.body may produce
//       // different bytes and cause signature mismatch.
//       const payload = req.rawBody
//         ? req.rawBody
//         : Buffer.from(JSON.stringify(body));

//       const hash = crypto
//         .createHmac('sha512', PAYSTACK_SECRET_KEY)
//         .update(payload)
//         .digest('hex');

//       if (hash !== paystackSignature) {
//         logger.warn('Invalid Paystack webhook signature');
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//     } else if (provider === 'flutterwave') {
//       if (!safeEqual(flutterwaveSignature, FLUTTERWAVE_SECRET_HASH)) {
//         logger.warn('Invalid Flutterwave webhook signature');
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//     }

//     // ============================================
//     // STEP 3: Extract Reference & Status
//     // ============================================
//     let reference = null;
//     let event = null;
//     let status = null;

//     if (provider === 'paystack') {
//       const { event: evt, data } = body;
//       event = evt;
//       if (evt === 'charge.success') {
//         reference = data.reference;
//         status = data.status;
//       }
//     } else if (provider === 'flutterwave') {
//       const { event: evt, data } = body;
//       event = evt;
//       if (evt === 'charge.completed') {
//         reference = data.tx_ref;
//         status = data.status;
//       }
//     }

//     if (!reference) {
//       logger.info(`Webhook ignored (event: ${event}, provider: ${provider})`);
//       return res.status(200).json({ status: 'ignored' });
//     }

//     logger.info(`🔔 Webhook received: ${provider} - ${reference}`);

//     // ============================================
//     // STEP 4: Route to Giving or Orders
//     // ============================================
    
//     // ---- Try GIVING collection first ----
//     let givingFound = false;

//     const givingRefSnapshot = await db.collection('giving')
//       .where('reference', '==', reference)
//       .limit(1)
//       .get();

//     if (!givingRefSnapshot.empty) givingFound = true;

//     if (!givingFound) {
//       const givingFlwSnapshot = await db.collection('giving')
//         .where('flutterwaveRef', '==', reference)
//         .limit(1)
//         .get();
//       if (!givingFlwSnapshot.empty) givingFound = true;
//     }

//     if (!givingFound) {
//       const givingPstkSnapshot = await db.collection('giving')
//         .where('paystackRef', '==', reference)
//         .limit(1)
//         .get();
//       if (!givingPstkSnapshot.empty) givingFound = true;
//     }

//     if (givingFound) {
//       logger.info(`✅ Found in GIVING collection: ${reference}`);
//       return givingController.webhook(req, res);
//     }

//     // ---- Try ORDERS collection ----
//     const orderSnapshot = await db.collection('orders')
//       .where('paymentReference', '==', reference)
//       .limit(1)
//       .get();

//     if (!orderSnapshot.empty) {
//       logger.info(`✅ Found in ORDERS collection: ${reference}`);

//       const orderDoc = orderSnapshot.docs[0];
//       const orderId = orderDoc.id;

//       const isSuccess = status === 'successful' || status === 'success';

//       const updates = {
//         paymentStatus: isSuccess ? 'paid' : 'failed',
//         paymentResponse: body.data,
//         updatedAt: FieldValue.serverTimestamp(),
//         paymentProvider: provider,
//       };

//       if (isSuccess) {
//         updates.status = 'confirmed';
//       }

//       await db.collection('orders').doc(orderId).update(updates);

//       logger.info(`📦 Order updated: ${orderId} → ${updates.paymentStatus}`);

//       return res.status(200).json({ status: 'success' });
//     }

//     // ============================================
//     // STEP 5: Not Found in Any Collection
//     // ============================================
//     logger.warn(`⚠️ Reference not found in any collection: ${reference}`);
//     return res.status(200).json({ status: 'not_found' });

//   } catch (error) {
//     logger.error('Webhook processing error:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

// backend/src/routes/webhooks.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { db, FieldValue } = require('../config/firebase');
const { logger } = require('../utils/logger');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH;

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    const paystackSignature = req.headers['x-paystack-signature'];
    const flutterwaveSignature = req.headers['verif-hash'];

    // ============================================
    // STEP 1: Detect provider from signature header
    //   - Paystack sends: x-paystack-signature
    //   - Flutterwave sends: verif-hash
    // ============================================
    let provider = null;
    if (paystackSignature) {
      provider = 'paystack';
    } else if (flutterwaveSignature) {
      provider = 'flutterwave';
    } else {
      logger.warn('Webhook received with no signature');
      return res.status(401).json({ message: 'No signature provided' });
    }

    // ============================================
    // STEP 2: Verify signature (ONCE, using raw body for Paystack)
    // ============================================
    if (provider === 'paystack') {
      const payload = req.rawBody
        ? req.rawBody
        : Buffer.from(JSON.stringify(body));

      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest('hex');

      if (hash !== paystackSignature) {
        logger.warn('Invalid Paystack webhook signature');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else if (provider === 'flutterwave') {
      if (!safeEqual(flutterwaveSignature, FLUTTERWAVE_SECRET_HASH)) {
        logger.warn('Invalid Flutterwave webhook signature');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    // ============================================
    // STEP 3: Extract reference + status
    //   - Paystack: fires 'charge.success', uses data.reference + data.status
    //   - Flutterwave: fires 'charge.completed', uses data.tx_ref + data.status
    // ============================================
    let reference = null;
    let event = null;
    let status = null;

    if (provider === 'paystack') {
      const { event: evt, data } = body;
      event = evt;
      if (evt === 'charge.success') {
        reference = data.reference;
        status = data.status;
      }
    } else if (provider === 'flutterwave') {
      const { event: evt, data } = body;
      event = evt;
      if (evt === 'charge.completed') {
        reference = data.tx_ref;
        status = data.status;
      }
    }

    if (!reference) {
      logger.info(`Webhook ignored (event: ${event}, provider: ${provider})`);
      return res.status(200).json({ status: 'ignored' });
    }

    logger.info(`🔔 Webhook received: ${provider} - ${reference}`);

    // ============================================
    // STEP 4: Find the giving record and update inline
    // ============================================
    let givingDoc = null;

    const givingRefSnapshot = await db.collection('giving')
      .where('reference', '==', reference)
      .limit(1)
      .get();
    if (!givingRefSnapshot.empty) givingDoc = givingRefSnapshot.docs[0];

    if (!givingDoc) {
      const givingFlwSnapshot = await db.collection('giving')
        .where('flutterwaveRef', '==', reference)
        .limit(1)
        .get();
      if (!givingFlwSnapshot.empty) givingDoc = givingFlwSnapshot.docs[0];
    }

    if (!givingDoc) {
      const givingPstkSnapshot = await db.collection('giving')
        .where('paystackRef', '==', reference)
        .limit(1)
        .get();
      if (!givingPstkSnapshot.empty) givingDoc = givingPstkSnapshot.docs[0];
    }

    if (givingDoc) {
      logger.info(`✅ Found in GIVING collection: ${reference}`);

      const isSuccess = status === 'successful' || status === 'success';
      const givingData = givingDoc.data();

      await db.collection('giving').doc(givingDoc.id).update({
        status: isSuccess ? 'successful' : 'failed',
        paidAt: isSuccess ? new Date().toISOString() : null,
        failedAt: isSuccess ? null : new Date().toISOString(),
        transactionData: body.data,
        paymentMethod: provider,
        provider: provider,
        updatedAt: FieldValue.serverTimestamp(),
      });

      if (isSuccess && givingData.userId && givingData.amount) {
        const userRef = db.collection('users').doc(givingData.userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const currentTotal = userDoc.data().totalGiven || 0;
          await userRef.update({
            totalGiven: currentTotal + givingData.amount,
          });
        }
      }

      logger.info(`💰 Giving updated: ${reference} → ${isSuccess ? 'successful' : 'failed'}`);
      return res.status(200).json({ status: 'success' });
    }

    // ============================================
    // STEP 5: Try ORDERS collection
    // ============================================
    const orderSnapshot = await db.collection('orders')
      .where('paymentReference', '==', reference)
      .limit(1)
      .get();

    if (!orderSnapshot.empty) {
      logger.info(`✅ Found in ORDERS collection: ${reference}`);

      const orderDoc = orderSnapshot.docs[0];
      const orderId = orderDoc.id;

      const isSuccess = status === 'successful' || status === 'success';

      const updates = {
        paymentStatus: isSuccess ? 'paid' : 'failed',
        paymentResponse: body.data,
        updatedAt: FieldValue.serverTimestamp(),
        paymentProvider: provider,
      };

      if (isSuccess) {
        updates.status = 'confirmed';
      }

      await db.collection('orders').doc(orderId).update(updates);

      logger.info(`📦 Order updated: ${orderId} → ${updates.paymentStatus}`);

      return res.status(200).json({ status: 'success' });
    }

    // ============================================
    // STEP 6: Not found
    // ============================================
    logger.warn(`⚠️ Reference not found in any collection: ${reference}`);
    return res.status(200).json({ status: 'not_found' });

  } catch (error) {
    logger.error('Webhook processing error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;