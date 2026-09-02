const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  resetPassword,
  deleteAccount,
  logout,
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);
router.post('/logout', authenticateUser, logout);
router.delete('/account', authenticateUser, deleteAccount);

module.exports = router;