// // backend\src\routes\users.js
// const express = require('express');
// const router = express.Router();
// const { authenticateUser, requireAdmin } = require('../middleware/auth');
// const User = require('../models/User');
// const { logger } = require('../utils/logger');

// // GET all users (Admin only)
// router.get('/', authenticateUser, requireAdmin, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search } = req.query;
    
//     let result;
//     if (search) {
//       result = await User.search(search, parseInt(page), parseInt(limit));
//     } else {
//       result = await User.getAll(parseInt(page), parseInt(limit));
//     }
    
//     res.json({ success: true, ...result });
//   } catch (error) {
//     logger.error('Error fetching users:', error);
//     res.status(500).json({ success: false, message: 'Error fetching users' });
//   }
// });

// // GET single user (Admin only)
// router.get('/:id', authenticateUser, requireAdmin, async (req, res) => {
//   try {
//     const user = await User.getById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     logger.error('Error fetching user:', error);
//     res.status(500).json({ success: false, message: 'Error fetching user' });
//   }
// });

// // UPDATE user role (Admin only)
// router.put('/:id/role', authenticateUser, requireAdmin, async (req, res) => {
//   try {
//     const { role } = req.body;
//     if (!role || !['member', 'pastor', 'admin'].includes(role)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid role. Must be member, pastor, or admin' 
//       });
//     }
//     await User.updateRole(req.params.id, role);
//     res.json({ success: true, message: `User role updated to ${role}` });
//   } catch (error) {
//     logger.error('Error updating user role:', error);
//     res.status(500).json({ success: false, message: 'Error updating user role' });
//   }
// });

// // DELETE user (Admin only)
// router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
//   try {
//     await User.delete(req.params.id);
//     res.json({ success: true, message: 'User deleted successfully' });
//   } catch (error) {
//     logger.error('Error deleting user:', error);
//     res.status(500).json({ success: false, message: 'Error deleting user' });
//   }
// });

// module.exports = router;

// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const { logger } = require('../utils/logger');

// ============================================
// ✅ PROFILE ROUTES — must come before /:id
// ============================================

// GET own profile (any logged-in user)
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.getById(req.user.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error fetching own profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

// UPDATE own profile (any logged-in user)
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName, phoneNumber, address, photoURL } = req.body;

    const updateData = {};
    if (displayName !== undefined) updateData.displayName = String(displayName).trim();
    if (phoneNumber !== undefined) updateData.phoneNumber = String(phoneNumber).trim();
    if (address !== undefined) updateData.address = String(address).trim();
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    updateData.updatedAt = new Date().toISOString();

    const fieldsToUpdate = Object.keys(updateData).filter((k) => k !== 'updatedAt');
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    await User.update(userId, updateData);
    const updated = await User.getById(userId);

    res.json({
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    logger.error('Error updating own profile:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET all users (Admin only)
router.get('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let result;
    if (search) {
      result = await User.search(search, parseInt(page), parseInt(limit));
    } else {
      result = await User.getAll(parseInt(page), parseInt(limit));
    }

    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// GET single user (Admin only)
router.get('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
});

// UPDATE user role (Admin only)
router.put('/:id/role', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['member', 'pastor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be member, pastor, or admin',
      });
    }
    await User.updateRole(req.params.id, role);
    res.json({ success: true, message: `User role updated to ${role}` });
  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(500).json({ success: false, message: 'Error updating user role' });
  }
});

// DELETE user (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

module.exports = router;