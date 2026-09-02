const { auth } = require('../config/firebase');
const { logger } = require('../utils/logger');

/**
 * Authenticate user using Firebase ID token
 */
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Check if user has required role
 */
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { db } = require('../config/firebase');
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return res.status(403).json({ 
          success: false, 
          message: 'User profile not found' 
        });
      }

      const userData = userDoc.data();
      if (!allowedRoles.includes(userData.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      req.userProfile = userData;
      next();
    } catch (error) {
      logger.error('Role check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error checking permissions' 
      });
    }
  };
};

const requireAdmin = checkRole(['admin']);
const requirePastor = checkRole(['admin', 'pastor']);

module.exports = { authenticateUser, checkRole, requireAdmin, requirePastor };