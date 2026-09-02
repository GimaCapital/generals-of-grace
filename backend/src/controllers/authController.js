const User = require('../models/User');
const { auth } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { sendEmail } = require('../services/emailService');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, displayName, phoneNumber } = req.body;

    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      phoneNumber,
    });

    const user = await User.create({
      uid: userRecord.uid,
      email,
      displayName: displayName || email.split('@')[0],
      phoneNumber: phoneNumber || '',
    });

    await sendEmail({
      to: email,
      template: 'welcome',
      data: {
        displayName: displayName || email.split('@')[0],
        titheNumber: user.titheNumber,
      },
    });

    logger.info(`👤 New user registered: ${email}`);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        titheNumber: user.titheNumber,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const user = await User.getById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    logger.info(`👤 User logged in: ${user.email}`);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        titheNumber: user.titheNumber,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const user = await User.getById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName, phoneNumber, address, preferences } = req.body;

    const user = await User.getById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (preferences !== undefined) updateData.preferences = preferences;

    await User.update(uid, updateData);

    if (displayName) {
      await auth.updateUser(uid, { displayName });
    }

    logger.info(`👤 User profile updated: ${user.email}`);
    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

/**
 * Reset password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const resetLink = await auth.generatePasswordResetLink(email);

    await sendEmail({
      to: email,
      template: 'password_reset',
      data: {
        resetLink,
      },
    });

    logger.info(`🔑 Password reset requested for: ${email}`);
    res.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reset email',
      error: error.message,
    });
  }
};

/**
 * Delete account
 */
exports.deleteAccount = async (req, res) => {
  try {
    const uid = req.user.uid;

    await User.delete(uid);
    await auth.deleteUser(uid);

    logger.info(`🗑️ User account deleted: ${uid}`);
    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message,
    });
  }
};

/**
 * Logout user
 */
exports.logout = async (req, res) => {
  try {
    const uid = req.user?.uid || 'unknown';
    logger.info(`👤 User logged out: ${uid}`);
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};