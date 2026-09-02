const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const Ministry = require('../models/Ministry');
const { logger } = require('../utils/logger');

// GET all ministries
router.get('/', async (req, res) => {
  try {
    const ministries = await Ministry.getAll();
    res.json({ success: true, data: ministries });
  } catch (error) {
    logger.error('Error fetching ministries:', error);
    res.status(500).json({ success: false, message: 'Error fetching ministries' });
  }
});

// GET single ministry
router.get('/:id', async (req, res) => {
  try {
    const ministry = await Ministry.getById(req.params.id);
    if (!ministry) {
      return res.status(404).json({ success: false, message: 'Ministry not found' });
    }
    res.json({ success: true, data: ministry });
  } catch (error) {
    logger.error('Error fetching ministry:', error);
    res.status(500).json({ success: false, message: 'Error fetching ministry' });
  }
});

// POST - Create ministry (Admin only)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const ministry = await Ministry.create(req.body);
    res.status(201).json({ success: true, message: 'Ministry created', data: ministry });
  } catch (error) {
    logger.error('Error creating ministry:', error);
    res.status(500).json({ success: false, message: 'Error creating ministry' });
  }
});

// PUT - Update ministry (Admin only)
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Ministry.update(req.params.id, req.body);
    res.json({ success: true, message: 'Ministry updated' });
  } catch (error) {
    logger.error('Error updating ministry:', error);
    res.status(500).json({ success: false, message: 'Error updating ministry' });
  }
});

// DELETE - Delete ministry (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Ministry.delete(req.params.id);
    res.json({ success: true, message: 'Ministry deleted' });
  } catch (error) {
    logger.error('Error deleting ministry:', error);
    res.status(500).json({ success: false, message: 'Error deleting ministry' });
  }
});

// Join ministry
router.post('/:id/join', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    await Ministry.addMember(req.params.id, userId);
    res.json({ success: true, message: 'Joined ministry successfully' });
  } catch (error) {
    logger.error('Error joining ministry:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to join ministry' });
  }
});

// Leave ministry
router.delete('/:id/join', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    await Ministry.removeMember(req.params.id, userId);
    res.json({ success: true, message: 'Left ministry successfully' });
  } catch (error) {
    logger.error('Error leaving ministry:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to leave ministry' });
  }
});

module.exports = router;