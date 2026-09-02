const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');
const Event = require('../models/Event');
const { logger } = require('../utils/logger');


// GET all events (for homepage)
router.get('/all', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const snapshot = await Database.getCollection('events')
      .orderBy('date', 'asc')
      .limit(parseInt(limit))
      .get();
    
    const events = [];
    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, data: events });
  } catch (error) {
    logger.error('Error fetching all events:', error);
    res.json({ success: true, data: [] });
  }
});

// GET all events
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    const filters = [];
    if (type && type !== 'all') {
      filters.push({ field: 'type', operator: '==', value: type });
    }
    if (status) {
      filters.push({ field: 'status', operator: '==', value: status });
    }

    const result = await Event.getAll(parseInt(page), parseInt(limit), filters);
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
});

// GET upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.getUpcoming(3);
    res.json({ success: true, data: events });
  } catch (error) {
    logger.error('Error fetching upcoming events:', error);
    res.status(500).json({ success: false, message: 'Error fetching upcoming events' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    logger.error('Error fetching event:', error);
    res.status(500).json({ success: false, message: 'Error fetching event' });
  }
});

// POST - Create event (Admin only)
router.post('/', authenticateUser, requireAdmin, validateEvent, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, message: 'Event created', data: event });
  } catch (error) {
    logger.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Error creating event' });
  }
});

// PUT - Update event (Admin only)
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Event.update(req.params.id, req.body);
    res.json({ success: true, message: 'Event updated' });
  } catch (error) {
    logger.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Error updating event' });
  }
});

// DELETE - Delete event (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Event.delete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    logger.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Error deleting event' });
  }
});

// Register for event
router.post('/:id/register', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    await Event.register(req.params.id, userId, req.body);
    res.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    logger.error('Error registering for event:', error);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
});

// Cancel registration
router.delete('/:id/register', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    await Event.cancelRegistration(req.params.id, userId);
    res.json({ success: true, message: 'Registration canceled' });
  } catch (error) {
    logger.error('Error canceling registration:', error);
    res.status(500).json({ success: false, message: error.message || 'Cancelation failed' });
  }
});

module.exports = router;