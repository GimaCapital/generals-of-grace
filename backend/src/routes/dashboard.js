const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const User = require('../models/User');
const Sermon = require('../models/Sermon');
const Event = require('../models/Event');
const Giving = require('../models/Giving');
const Ministry = require('../models/Ministry');

/**
 * Get dashboard statistics (Admin only)
 */
router.get('/stats', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const [
      userStats,
      sermonStats,
      eventStats,
      givingStats,
      ministryStats,
    ] = await Promise.all([
      User.getAll(1, 1),
      Sermon.getPublished(1, 1),
      Event.getAll(1, 1),
      Giving.getStats(),
      Ministry.getActive(),
    ]);

    const recentGiving = await Giving.getAll(1, 10);
    const recentEvents = await Event.getUpcoming(5);
    const recentSermons = await Sermon.getRecent(5);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: userStats.pagination?.total || 0,
          totalSermons: sermonStats.pagination?.total || 0,
          totalEvents: eventStats.pagination?.total || 0,
          totalGiving: givingStats.total || 0,
          totalMinistries: ministryStats.length || 0,
        },
        giving: {
          total: givingStats.total || 0,
          count: givingStats.count || 0,
          byType: givingStats.byType || {},
          byMonth: givingStats.byMonth || {},
        },
        recent: {
          giving: recentGiving.data || [],
          events: recentEvents || [],
          sermons: recentSermons || [],
        },
      },
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
    });
  }
});

module.exports = router;