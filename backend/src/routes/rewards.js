// backend/src/routes/rewards.js
const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const grouped = await Reward.getActiveGrouped();
    res.json({ success: true, data: grouped });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards' });
  }
});

// ADMIN
router.get('/admin/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const rewards = await Reward.getAll();
    res.json({ success: true, data: rewards });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards' });
  }
});

router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json({ success: true, data: reward });
  } catch (error) {
    console.error('Error creating reward:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create reward' });
  }
});

router.put('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Reward.update(req.params.docId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating reward:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update reward' });
  }
});

router.delete('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Reward.delete(req.params.docId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reward:', error);
    res.status(500).json({ success: false, message: 'Failed to delete reward' });
  }
});

module.exports = router;