// const admin = require('firebase-admin');
// const fs = require('fs');
// const path = require('path');
// const { logger } = require('../utils/logger');

// /**
//  * Get Firebase credentials from multiple sources
//  */
// const getCredentials = () => {
//   // 1️⃣ Environment Variables (Production)
//   if (process.env.FIREBASE_PROJECT_ID && 
//       process.env.FIREBASE_CLIENT_EMAIL && 
//       process.env.FIREBASE_PRIVATE_KEY) {
//     logger.info('✅ Using Firebase credentials from environment variables');
//     return {
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     };
//   }

//   // 2️⃣ serviceAccountKey.json (Local Development)
//   const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
//   if (fs.existsSync(serviceAccountPath)) {
//     logger.info('✅ Using Firebase credentials from serviceAccountKey.json');
//     return require(serviceAccountPath);
//   }

//   // ❌ No credentials found
//   logger.error('❌ No Firebase credentials found!');
//   logger.error('   Please set environment variables or add serviceAccountKey.json');
//   process.exit(1);
// };

// // Initialize Firebase
// try {
//   const credentials = getCredentials();
  
//   admin.initializeApp({
//     credential: admin.credential.cert(credentials),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//   });

//   logger.info('✅ Firebase initialized successfully');
// } catch (error) {
//   logger.error('❌ Failed to initialize Firebase:', error.message);
//   process.exit(1);
// }

// // Firestore Database
// const db = admin.firestore();

// // Firebase Authentication
// const auth = admin.auth();

// // Firebase Storage
// const storage = admin.storage();

// // Firestore settings
// db.settings({
//   ignoreUndefinedProperties: true,
//   timestampsInSnapshots: true,
// });

// // Firestore FieldValue helpers
// const FieldValue = admin.firestore.FieldValue;
// const Timestamp = admin.firestore.Timestamp;

// module.exports = {
//   admin,
//   db,
//   auth,
//   storage,
//   FieldValue,
//   Timestamp,
// };

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { logger } = require('../utils/logger');

// Try to load credentials from multiple sources
let credentials = null;
let credSource = '';

// 1️⃣ Try loading from serviceAccountKey.json file (RECOMMENDED)
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
  try {
    credentials = require(serviceAccountPath);
    credSource = 'serviceAccountKey.json file';
    logger.info(`✅ Using Firebase credentials from ${credSource}`);
  } catch (error) {
    logger.error('❌ Error reading serviceAccountKey.json:', error.message);
  }
}

// 2️⃣ Try loading from environment variables (if file not found)
if (!credentials) {
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY) {
    try {
      credentials = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      credSource = 'environment variables';
      logger.info(`✅ Using Firebase credentials from ${credSource}`);
    } catch (error) {
      logger.error('❌ Error parsing environment variables:', error.message);
    }
  }
}

// ❌ No credentials found
if (!credentials) {
  // logger.error('❌ No Firebase credentials found!');
  // logger.error('   Please ensure serviceAccountKey.json exists in the backend folder');
  // logger.error('   Or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
  process.exit(1);
}

// ✅ FIX: Initialize Firebase using the NEW modular approach
// Check if we can use the modern API
let db, auth, storage, FieldValue, Timestamp;

try {
  // Try using the new modular API first
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getFirestore, FieldValue: FV } = require('firebase-admin/firestore');
  const { getAuth } = require('firebase-admin/auth');
  const { getStorage } = require('firebase-admin/storage');

  // Initialize using new API
  initializeApp({
    credential: cert(credentials),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || credentials.projectId + '.appspot.com',
  });

  db = getFirestore();
  auth = getAuth();
  storage = getStorage();
  FieldValue = FV;
  Timestamp = require('firebase-admin/firestore').Timestamp;

  logger.info('✅ Firebase initialized successfully (using modular API)');
} catch (error) {
  // If new API fails, try the legacy API
  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || credentials.projectId + '.appspot.com',
    });

    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
    FieldValue = admin.firestore.FieldValue;
    Timestamp = admin.firestore.Timestamp;

    logger.info('✅ Firebase initialized successfully (using legacy API)');
  } catch (legacyError) {
    logger.error('❌ Failed to initialize Firebase:', legacyError.message);
    logger.error('   Please check your credentials and try again.');
    process.exit(1);
  }
}

db.settings({
  ignoreUndefinedProperties: true,
  timestampsInSnapshots: true,
});

module.exports = {
  admin,
  db,
  auth,
  storage,
  FieldValue,
  Timestamp,
};