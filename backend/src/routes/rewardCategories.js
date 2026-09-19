// backend/src/routes/rewardCategories.js
const express = require('express');
const router = express.Router();
const RewardCategory = require('../models/RewardCategory');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const categories = await RewardCategory.getActive();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// ADMIN
router.get('/admin/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const categories = await RewardCategory.getAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
});

router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const category = await RewardCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create' });
  }
});

router.put('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await RewardCategory.update(req.params.docId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

router.delete('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await RewardCategory.delete(req.params.docId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
});

module.exports = router;