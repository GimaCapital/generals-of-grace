// backend/src/routes/souls.js
const express = require('express');
const router = express.Router();
const Soul = require('../models/Soul');
const Badge = require('../models/Badge');
const { authenticateUser, requirePastor } = require('../middleware/auth');

/**
 * POST /api/souls
 * Record a new soul won
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, phone, email, dateWon, location, method, status, notes } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const soul = await Soul.create({
      userId,
      name: name.trim(),
      phone: phone || null,
      email: email || null,
      dateWon: dateWon || new Date().toISOString(),
      location: location || '',
      method: method || 'personal',
      status: status || 'reached',
      notes: notes || '',
    });

    // Auto-award badges based on new stats
    const stats = await Soul.getStats(userId);
    const badges = await Badge.checkAndAward(userId, stats);

    res.status(201).json({ success: true, data: soul, badges });
  } catch (error) {
    console.error('Error creating soul:', error);
    res.status(500).json({ success: false, message: 'Failed to record soul' });
  }
});

/**
 * GET /api/souls/user/:userId
 * Get all souls won by a user
 */
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const souls = await Soul.getByUser(userId);
    res.json({ success: true, data: souls });
  } catch (error) {
    console.error('Error fetching souls:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch souls' });
  }
});

/**
 * GET /api/souls/stats/:userId
 * Get soul stats for a user
 */
router.get('/stats/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await Soul.getStats(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching soul stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ============================================
// ADMIN / PASTOR ROUTES — must come before /:id
// ============================================

/**
 * GET /api/souls/all
 * Admin/Pastor: get all souls across all members, with filters
 */
router.get('/all', authenticateUser, requirePastor, async (req, res) => {
  try {
    const {
      userId,
      status,
      method,
      month,
      search,
      limit = 100,
      offset = 0,
    } = req.query;

    const Database = require('../config/database');

    // Build server-side filters
    const filters = [];
    if (userId) filters.push({ field: 'userId', operator: '==', value: userId });
    if (status) filters.push({ field: 'status', operator: '==', value: status });
    if (method) filters.push({ field: 'method', operator: '==', value: method });

    const allSouls = await Database.getDocs('souls', filters);

    // Client-side filters (avoids Firestore composite indexes)
    let filtered = allSouls;

    if (month) {
      filtered = filtered.filter((s) => {
        const d = s.dateWon || s.createdAt;
        return typeof d === 'string' && d.startsWith(month);
      });
    }

    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        const hay = [s.name, s.email, s.phone, s.location, s.notes]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }

    // Sort newest first
    filtered.sort((a, b) => {
      const aT = new Date(a.dateWon || a.createdAt).getTime();
      const bT = new Date(b.dateWon || b.createdAt).getTime();
      return bT - aT;
    });

    // Paginate
    const total = filtered.length;
    const start = parseInt(offset) || 0;
    const end = start + (parseInt(limit) || 100);
    const page = filtered.slice(start, end);

    // Enrich with member info
    const userIds = [...new Set(page.map((s) => s.userId).filter(Boolean))];
    const userMap = {};
    if (userIds.length > 0) {
      const userSnapshot = await Database.getCollection('users').get();
      userSnapshot.forEach((doc) => {
        const u = { id: doc.id, ...doc.data() };
        if (userIds.includes(u.id)) userMap[u.id] = u;
      });
    }

    const enriched = page.map((s) => ({
      ...s,
      member: userMap[s.userId]
        ? {
            uid: s.userId,
            displayName: userMap[s.userId].displayName || 'Unknown',
            email: userMap[s.userId].email || '',
            titheNumber: userMap[s.userId].titheNumber || '',
          }
        : {
            uid: s.userId,
            displayName: 'Unknown',
            email: '',
            titheNumber: '',
          },
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: {
        total,
        limit: parseInt(limit) || 100,
        offset: start,
        pages: Math.ceil(total / (parseInt(limit) || 100)),
      },
    });
  } catch (error) {
    console.error('Error fetching all souls:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch souls' });
  }
});

/**
 * GET /api/souls/admin-stats
 * Admin/Pastor: church-wide soul-winning stats
 */
router.get('/admin-stats', authenticateUser, requirePastor, async (req, res) => {
  try {
    const Database = require('../config/database');
    const allSouls = await Database.getDocs('souls', []);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const stats = {
      total: allSouls.length,
      thisMonth: 0,
      thisWeek: 0,
      uniqueWinners: 0,
      byStatus: {},
      byMethod: {},
      byLocation: {},
      byMonth: {},
    };

    const winnerSet = new Set();

    allSouls.forEach((s) => {
      const d = new Date(s.dateWon || s.createdAt);
      if (d >= monthStart) stats.thisMonth += 1;
      if (d >= weekStart) stats.thisWeek += 1;

      if (s.userId) winnerSet.add(s.userId);

      const status = s.status || 'reached';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      const method = s.method || 'personal';
      stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;

      const location = (s.location || 'Unknown').trim();
      stats.byLocation[location] = (stats.byLocation[location] || 0) + 1;

      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;
    });

    stats.uniqueWinners = winnerSet.size;

    // Top 5 soul winners
    const byUser = {};
    allSouls.forEach((s) => {
      if (!s.userId) return;
      if (!byUser[s.userId]) byUser[s.userId] = 0;
      byUser[s.userId] += 1;
    });

    const topIds = Object.entries(byUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const userSnapshot = await Database.getCollection('users').get();
    const userMap = {};
    userSnapshot.forEach((doc) => {
      userMap[doc.id] = { id: doc.id, ...doc.data() };
    });

    stats.topWinners = topIds.map(([uid, count]) => ({
      uid,
      count,
      displayName: userMap[uid]?.displayName || 'Unknown',
      email: userMap[uid]?.email || '',
      titheNumber: userMap[uid]?.titheNumber || '',
    }));

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

/**
 * DELETE /api/souls/:id
 * Delete a soul (own only — or admin)
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const soul = await Soul.getById(req.params.id);
    if (!soul) {
      return res.status(404).json({ success: false, message: 'Soul not found' });
    }

    // Owner can delete their own; admins/pastors can delete any
    const { db } = require('../config/firebase');
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const role = userDoc.exists ? userDoc.data().role : null;
    const isPrivileged = role === 'admin' || role === 'pastor';

    if (soul.userId !== req.user.uid && !isPrivileged) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Soul.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting soul:', error);
    res.status(500).json({ success: false, message: 'Failed to delete soul' });
  }
});

module.exports = router;