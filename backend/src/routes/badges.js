// backend/src/routes/badges.js
const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const Soul = require('../models/Soul');
const { authenticateUser } = require('../middleware/auth');

/**
 * GET /api/badges
 * List all badge definitions
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const badges = await Badge.getAll();
    res.json({ success: true, data: badges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch badges' });
  }
});

/**
 * GET /api/badges/user/:userId
 * Get all badges earned by a user
 */
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    const badges = await Badge.getUserBadges(req.params.userId);
    res.json({ success: true, data: badges });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user badges' });
  }
});

/**
 * GET /api/badges/progress/:userId
 * Get progress toward every badge (earned + in-progress)
 * Also re-checks and awards newly earned badges.
 */
router.get('/progress/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await Soul.getStats(userId);
    const progress = await Badge.checkAndAward(userId, stats);
    res.json({ success: true, data: progress, stats });
  } catch (error) {
    console.error('Error fetching badge progress:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch progress' });
  }
});

module.exports = router;