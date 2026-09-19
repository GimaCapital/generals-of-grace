// backend/src/routes/badges.js
const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const Soul = require('../models/Soul');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * GET /api/badges
 * Public: list all badge definitions
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
 * Get progress toward every badge
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

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * GET /api/badges/admin/all
 * Admin: get all badges (including inactive) with docId
 */
router.get('/admin/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const badges = await Badge.getAllAdmin();
    res.json({ success: true, data: badges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch badges' });
  }
});

/**
 * POST /api/badges
 * Admin: create a badge
 */
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json({ success: true, data: badge });
  } catch (error) {
    console.error('Error creating badge:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create badge' });
  }
});

/**
 * PUT /api/badges/:docId
 * Admin: update a badge
 */
router.put('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Badge.update(req.params.docId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating badge:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update badge' });
  }
});

/**
 * DELETE /api/badges/:docId
 * Admin: delete a badge
 */
router.delete('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Badge.delete(req.params.docId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting badge:', error);
    res.status(500).json({ success: false, message: 'Failed to delete badge' });
  }
});

module.exports = router;