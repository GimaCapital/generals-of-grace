// backend/src/models/Badge.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'badges';
const USER_BADGES = 'userBadges';

class Badge {
  /**
   * Create a badge definition — with duplicate name prevention
   */
  static async create(data) {
    try {
      const name = data.name?.trim();
      if (!name) throw new Error('Name is required');

      // ✅ Prevent duplicate badge names
      const all = await this.getAllAdmin();
      const dup = all.find((b) => b.name.toLowerCase() === name.toLowerCase());
      if (dup) {
        const err = new Error(`A badge named "${dup.name}" already exists`);
        err.code = 'DUPLICATE';
        throw err;
      }

      const badge = {
        id: data.id || name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: data.description || '',
        emoji: data.emoji || '🏅',
        category: data.category || 'milestone',
        requirement: data.requirement || {},
        order: Number(data.order) || 99,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docId = await Database.createDoc(COLLECTION, badge);
      logger.info(`🏅 Badge created: ${badge.name}`);
      return { docId, ...badge };
    } catch (error) {
      logger.error('Error creating badge:', error.message);
      throw error;
    }
  }

  /**
   * Get all badge definitions (sorted by order) — public shape
   */
  static async getAll() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const badges = [];
      snapshot.forEach((doc) => {
        badges.push({ docId: doc.id, ...doc.data() });
      });
      return badges.sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (error) {
      logger.error('Error getting badges:', error);
      throw error;
    }
  }

  /**
   * Get all badges — admin shape (same as getAll, kept for API symmetry)
   */
  static async getAllAdmin() {
    return this.getAll();
  }

  /**
   * Get a badge by its human-readable id
   */
  static async getById(badgeId) {
    try {
      const results = await Database.getDocs(COLLECTION, [
        { field: 'id', operator: '==', value: badgeId },
      ]);
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
      const results = await Database.getDocs(USER_BADGES, [
        { field: 'userId', operator: '==', value: userId },
      ]);
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
      const existing = await Database.getDocs(USER_BADGES, [
        { field: 'userId', operator: '==', value: userId },
        { field: 'badgeId', operator: '==', value: badgeId },
      ]);
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
   * Update a badge — with duplicate name prevention
   */
  static async update(docId, data) {
    try {
      // ✅ Prevent renaming into a duplicate
      if (data.name) {
        const name = data.name.trim();
        const all = await this.getAllAdmin();
        const dup = all.find(
          (b) =>
            b.name.toLowerCase() === name.toLowerCase() && b.docId !== docId
        );
        if (dup) {
          const err = new Error(`A badge named "${dup.name}" already exists`);
          err.code = 'DUPLICATE';
          throw err;
        }
        data.name = name;
      }

      // Coerce numbers
      if (data.order !== undefined) data.order = Number(data.order) || 99;

      return Database.updateDoc(COLLECTION, docId, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error updating badge:', error.message);
      throw error;
    }
  }

  /**
   * Delete a badge
   */
  static async delete(docId) {
    return Database.deleteDoc(COLLECTION, docId);
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
        // Skip inactive badges
        if (badge.active === false) continue;

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
          results.push({
            ...badge,
            earned: true,
            earnedAt: new Date().toISOString(),
            progress,
            target,
          });
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