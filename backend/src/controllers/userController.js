// backend/src/controllers/userController.js
const User = require('../models/User');
const { logger } = require('../utils/logger');

/**
 * ✅ Get all users (Admin only) - Returns flat array
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsersFlat();
    
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.getById(userId);
    
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
    logger.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName, phoneNumber, photoURL } = req.body;
    
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (photoURL) updateData.photoURL = photoURL;
    updateData.updatedAt = new Date().toISOString();
    
    await User.update(userId, updateData);
    
    const user = await User.getById(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
    });
  }
};

/**
 * Update user role (Admin only)
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const validRoles = ['member', 'pastor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: member, pastor, or admin',
      });
    }
    
    await User.updateRole(id, role);
    
    res.json({
      success: true,
      message: 'User role updated successfully',
    });
  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
    });
  }
};

/**
 * Delete user (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
    });
  }
};