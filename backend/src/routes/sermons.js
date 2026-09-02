const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { validateSermon } = require('../middleware/validation');
const Sermon = require('../models/Sermon');
const { logger } = require('../utils/logger');

// GET all sermons (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, speaker, search } = req.query;
    
    const filters = [];
    if (category && category !== 'All') {
      filters.push({ field: 'categories', operator: 'array-contains', value: category });
    }
    if (speaker) {
      filters.push({ field: 'speaker', operator: '==', value: speaker });
    }

    const result = await Sermon.getAll(
      parseInt(page),
      parseInt(limit),
      filters,
      search
    );
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Error fetching sermons:', error);
    res.status(500).json({ success: false, message: 'Error fetching sermons' });
  }
});

// ✅ GET live sermon - MUST BE BEFORE /:id route
router.get('/live', async (req, res) => {
  try {
    const sermon = await Sermon.getLive();
    if (!sermon) {
      return res.status(404).json({ 
        success: false, 
        message: 'No live sermon available' 
      });
    }
    res.json({ success: true, data: sermon });
  } catch (error) {
    logger.error('Error fetching live sermon:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching live sermon' 
    });
  }
});

// GET single sermon - THIS MUST COME AFTER /live
router.get('/:id', async (req, res) => {
  try {
    const sermon = await Sermon.getById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: 'Sermon not found' });
    }
    await Sermon.incrementViews(req.params.id);
    res.json({ success: true, data: sermon });
  } catch (error) {
    logger.error('Error fetching sermon:', error);
    res.status(500).json({ success: false, message: 'Error fetching sermon' });
  }
});

// POST - Create sermon (Admin only)
router.post('/', authenticateUser, requireAdmin, validateSermon, async (req, res) => {
  try {
    const sermon = await Sermon.create(req.body);
    res.status(201).json({ success: true, message: 'Sermon created', data: sermon });
  } catch (error) {
    logger.error('Error creating sermon:', error);
    res.status(500).json({ success: false, message: 'Error creating sermon' });
  }
});

// PUT - Update sermon (Admin only)
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Sermon.update(req.params.id, req.body);
    res.json({ success: true, message: 'Sermon updated' });
  } catch (error) {
    logger.error('Error updating sermon:', error);
    res.status(500).json({ success: false, message: 'Error updating sermon' });
  }
});

// DELETE - Delete sermon (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Sermon.delete(req.params.id);
    res.json({ success: true, message: 'Sermon deleted' });
  } catch (error) {
    logger.error('Error deleting sermon:', error);
    res.status(500).json({ success: false, message: 'Error deleting sermon' });
  }
});

module.exports = router;