// backend/src/models/Badge.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'badges';
const USER_BADGES = 'userBadges';

class Badge {
  /**
   * Create a badge definition (admin only, called by seed script)
   */
  static async create(data) {
    try {
      const badge = {
        id: data.id,
        name: data.name,
        description: data.description,
        emoji: data.emoji || '🏅',
        category: data.category || 'milestone',
        requirement: data.requirement || {},
        order: data.order || 99,
        createdAt: new Date().toISOString(),
      };
      await Database.createDoc(COLLECTION, badge);
      return badge;
    } catch (error) {
      logger.error('Error creating badge:', error);
      throw error;
    }
  }

  /**
   * Get all badge definitions (sorted by order)
   */
  static async getAll() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const badges = [];
      snapshot.forEach((doc) => {
        badges.push({ id: doc.id, ...doc.data() });
      });
      return badges.sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (error) {
      logger.error('Error getting badges:', error);
      throw error;
    }
  }

  /**
   * Get a badge by its human-readable id
   */
  static async getById(badgeId) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'id', operator: '==', value: badgeId }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting badge:', error);
      throw error;
    }
  }

  /**
   * Get all badges earned by a user
   */
  static async getUserBadges(userId) {
    try {
      const results = await Database.getDocs(
        USER_BADGES,
        [{ field: 'userId', operator: '==', value: userId }]
      );
      return results;
    } catch (error) {
      logger.error('Error getting user badges:', error);
      throw error;
    }
  }

  /**
   * Award a badge to a user (idempotent — no duplicate awards)
   */
  static async award(userId, badgeId) {
    try {
      // Check if already awarded
      const existing = await Database.getDocs(
        USER_BADGES,
        [
          { field: 'userId', operator: '==', value: userId },
          { field: 'badgeId', operator: '==', value: badgeId },
        ]
      );
      if (existing.length > 0) return existing[0];

      const record = {
        userId,
        badgeId,
        earnedAt: new Date().toISOString(),
      };
      const id = await Database.createDoc(USER_BADGES, record);
      logger.info(`🏅 Badge awarded: ${badgeId} to ${userId}`);
      return { id, ...record };
    } catch (error) {
      logger.error('Error awarding badge:', error);
      throw error;
    }
  }

  /**
   * Check which badges a user should have based on current stats,
   * award any newly earned, and return the full list with progress.
   */
  static async checkAndAward(userId, stats) {
    try {
      const allBadges = await this.getAll();
      const userBadges = await this.getUserBadges(userId);
      const earnedIds = new Set(userBadges.map((b) => b.badgeId));

      const results = [];

      for (const badge of allBadges) {
        const earned = earnedIds.has(badge.id);
        let progress = 0;
        let target = 0;

        const req = badge.requirement || {};
        if (req.soulsWon !== undefined) {
          target = req.soulsWon;
          progress = stats.total || 0;
        } else if (req.daysStreak !== undefined) {
          target = req.daysStreak;
          progress = 0; // streak calculation comes later
        }

        // Award if requirement met and not already earned
        if (progress >= target && target > 0 && !earned) {
          await this.award(userId, badge.id);
          earnedIds.add(badge.id);
          results.push({ ...badge, earned: true, earnedAt: new Date().toISOString(), progress, target });
        } else {
          const earnedRecord = userBadges.find((b) => b.badgeId === badge.id);
          results.push({
            ...badge,
            earned,
            earnedAt: earnedRecord?.earnedAt || null,
            progress,
            target,
          });
        }
      }

      return results;
    } catch (error) {
      logger.error('Error checking badges:', error);
      throw error;
    }
  }
}

module.exports = Badge;