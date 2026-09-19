// backend/src/routes/competitions.js
const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/competitions
 * List all competitions
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    // ✅ Auto-transition statuses based on dates
    await Competition.autoComplete();
    await Competition.autoStart();

    const comps = await Competition.getAll();
    res.json({ success: true, data: comps });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
});

/**
 * GET /api/competitions/active
 * List active competitions only
 */
router.get('/active', authenticateUser, async (req, res) => {
  try {
    // ✅ Auto-transition statuses based on dates
    await Competition.autoComplete();
    await Competition.autoStart();

    const comps = await Competition.getActive();
    res.json({ success: true, data: comps });
  } catch (error) {
    console.error('Error fetching active competitions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
});

/**
 * GET /api/competitions/:id
 * Get one competition with its leaderboard
 */
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    // ✅ Auto-transition statuses based on dates
    await Competition.autoComplete();
    await Competition.autoStart();

    const comp = await Competition.getById(req.params.id);
    if (!comp) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    const leaderboard = await Competition.getLeaderboard(req.params.id);
    const churchTotal = leaderboard.reduce((s, t) => s + t.soulsWon, 0);
    res.json({ success: true, data: { ...comp, leaderboard, churchTotal } });
  } catch (error) {
    console.error('Error fetching competition:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
});

/**
 * POST /api/competitions (admin only)
 */
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const comp = await Competition.create({
      ...req.body,
      createdBy: req.user.uid,
    });
    res.status(201).json({ success: true, data: comp });
  } catch (error) {
    console.error('Error creating competition:', error);
    res.status(500).json({ success: false, message: 'Failed to create' });
  }
});

/**
 * PUT /api/competitions/:id (admin only)
 */
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Competition.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating competition:', error);
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

/**
 * DELETE /api/competitions/:id (admin only)
 */
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    await Competition.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting competition:', error);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
});

/**
 * POST /api/competitions/:id/join
 * Join a team in a competition
 */
router.post('/:id/join', authenticateUser, async (req, res) => {
  try {
    const { teamId, teamName } = req.body;
    if (!teamId) {
      return res.status(400).json({ success: false, message: 'teamId is required' });
    }
    const participant = await Competition.join(
      req.params.id,
      req.user.uid,
      teamId,
      teamName || teamId
    );
    res.json({ success: true, data: participant });
  } catch (error) {
    console.error('Error joining competition:', error);
    res.status(500).json({ success: false, message: 'Failed to join' });
  }
});

/**
 * POST /api/competitions/:id/change-team
 * Change your team (one-time switch only)
 */
router.post('/:id/change-team', authenticateUser, async (req, res) => {
  try {
    const { teamId, teamName } = req.body;
    if (!teamId) {
      return res.status(400).json({ success: false, message: 'teamId is required' });
    }

    const result = await Competition.changeTeam(
      req.params.id,
      req.user.uid,
      teamId,
      teamName || teamId
    );

    if (!result.success) {
      const messages = {
        not_joined: 'You must join a team first',
        already_switched: 'You have already switched teams once. Contact an admin to change.',
        same_team: 'You are already on this team',
      };
      return res.status(400).json({
        success: false,
        message: messages[result.reason] || 'Could not change team',
      });
    }

    res.json({ success: true, data: result.participant });
  } catch (error) {
    console.error('Error changing team:', error);
    res.status(500).json({ success: false, message: 'Failed to change team' });
  }
});

/**
 * GET /api/competitions/:id/my-team
 * Get the current user's team standing in a competition
 */
router.get('/:id/my-team', authenticateUser, async (req, res) => {
  try {
    const participant = await Competition.getParticipant(req.params.id, req.user.uid);
    if (!participant) {
      return res.json({ success: true, data: null });
    }
    const leaderboard = await Competition.getLeaderboard(req.params.id);
    const team = leaderboard.find((t) => t.teamId === participant.teamId);
    res.json({ success: true, data: { participant, team, leaderboard } });
  } catch (error) {
    console.error('Error fetching my team:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
});

module.exports = router;