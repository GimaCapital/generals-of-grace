// backend/src/routes/testimonies.js
const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const Testimony = require('../models/Testimony');
const { logger } = require('../utils/logger');

// ============================================
// PUBLIC ROUTES (No auth required)
// ============================================

// GET approved testimonies
router.get('/', async (req, res) => {
  try {
    const { limit = 10, featured } = req.query;
    
    let testimonies;
    if (featured === 'true') {
      testimonies = await Testimony.getFeatured(parseInt(limit));
    } else {
      testimonies = await Testimony.getApproved(parseInt(limit));
    }
    
    res.json({ success: true, data: testimonies });
  } catch (error) {
    logger.error('Error fetching testimonies:', error);
    res.status(500).json({ success: false, message: 'Error fetching testimonies' });
  }
});

// POST - Submit testimony (Anyone can submit)
router.post('/', async (req, res) => {
  try {
    const { name, testimony, category, image, video, email, phone, location } = req.body;
    
    if (!name || !testimony) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and Testimony are required' 
      });
    }

    const testimonyData = {
      name: name.trim(),
      testimony: testimony.trim(),
      category: category || 'general',
      image: image || '',
      email: email || '',
      phone: phone || '',
      video: video || '',
      location: location || '',
      status: 'pending',
      userId: req.user?.uid || null,
    };

    const result = await Testimony.create(testimonyData);
    
    logger.info(`📝 New testimony submitted: ${result.id}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Testimony submitted successfully! It will be reviewed by our team.', 
      data: result 
    });
  } catch (error) {
    logger.error('Error submitting testimony:', error);
    res.status(500).json({ success: false, message: 'Error submitting testimony' });
  }
});

// ============================================
// ADMIN ROUTES (Require admin)
// ============================================

// GET all testimonies (admin)
router.get('/admin/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    let filters = [];
    
    if (status && status !== 'all') {
      filters.push({ field: 'status', operator: '==', value: status });
    }
    
    const testimonies = await Testimony.getAll(filters);
    res.json({ success: true, data: testimonies });
  } catch (error) {
    logger.error('Error fetching all testimonies:', error);
    res.status(500).json({ success: false, message: 'Error fetching testimonies' });
  }
});

// GET pending testimonies (admin)
router.get('/admin/pending', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const testimonies = await Testimony.getPending();
    res.json({ success: true, data: testimonies });
  } catch (error) {
    logger.error('Error fetching pending testimonies:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending testimonies' });
  }
});

// GET testimony stats (admin)
router.get('/admin/stats', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const stats = await Testimony.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error fetching testimony stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

router.put('/admin/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { name, testimony, category, image, video, email, phone, location } = req.body;
    
    const updateData = {
      name: name?.trim(),
      testimony: testimony?.trim(),
      category: category || 'general',
      image: image || '',
      video: video || '',
      email: email || '',
      phone: phone || '',
      location: location || '',
      editedByAdmin: true,
      editedAt: new Date().toISOString(),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    await Testimony.update(req.params.id, updateData);
    logger.info(`✏️ Testimony edited by admin: ${req.params.id}`);
    res.json({ success: true, message: 'Testimony updated successfully' });
  } catch (error) {
    logger.error('Error updating testimony:', error);
    res.status(500).json({ success: false, message: 'Error updating testimony' });
  }
});

// PUT - Approve testimony (admin)
router.put('/admin/:id/approve', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Testimony.approve(req.params.id);
    logger.info(`✅ Testimony approved: ${req.params.id}`);
    res.json({ success: true, message: 'Testimony approved successfully' });
  } catch (error) {
    logger.error('Error approving testimony:', error);
    res.status(500).json({ success: false, message: 'Error approving testimony' });
  }
});

// PUT - Reject testimony (admin)
router.put('/admin/:id/reject', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    await Testimony.reject(req.params.id, reason || '');
    logger.info(`❌ Testimony rejected: ${req.params.id}`);
    res.json({ success: true, message: 'Testimony rejected successfully' });
  } catch (error) {
    logger.error('Error rejecting testimony:', error);
    res.status(500).json({ success: false, message: 'Error rejecting testimony' });
  }
});

// DELETE - Delete testimony (admin)
router.delete('/admin/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Testimony.delete(req.params.id);
    logger.info(`🗑️ Testimony deleted: ${req.params.id}`);
    res.json({ success: true, message: 'Testimony deleted successfully' });
  } catch (error) {
    logger.error('Error deleting testimony:', error);
    res.status(500).json({ success: false, message: 'Error deleting testimony' });
  }
});

// PUT - Toggle featured (admin)
router.put('/admin/:id/featured', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { featured } = req.body;
    await Testimony.toggleFeatured(req.params.id, featured);
    res.json({ success: true, message: `Testimony ${featured ? 'featured' : 'unfeatured'}` });
  } catch (error) {
    logger.error('Error toggling featured:', error);
    res.status(500).json({ success: false, message: 'Error toggling featured' });
  }
});

module.exports = router;