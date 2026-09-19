// backend/src/routes/ranks.js
const express = require('express');
const router = express.Router();
const Rank = require('../models/Rank');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

// PUBLIC
router.get('/', async (req, res) => {
  try {
    const ranks = await Rank.getActive();
    res.json({ success: true, data: ranks });
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ranks' });
  }
});

// ADMIN
router.get('/admin/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const ranks = await Rank.getAll();
    res.json({ success: true, data: ranks });
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ranks' });
  }
});

router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const rank = await Rank.create(req.body);
    res.status(201).json({ success: true, data: rank });
  } catch (error) {
    console.error('Error creating rank:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create rank' });
  }
});

router.put('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Rank.update(req.params.docId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating rank:', error);
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        success: false,
        message: error.message,
        code: 'DUPLICATE',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update rank' });
  }
});

router.delete('/:docId', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Rank.delete(req.params.docId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting rank:', error);
    res.status(500).json({ success: false, message: 'Failed to delete rank' });
  }
});

module.exports = router;