// backend/src/models/Soul.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'souls';

class Soul {
  /**
   * Create a new soul record
   */
  static async create(data) {
    try {
      const record = {
        userId: data.userId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        dateWon: data.dateWon || new Date().toISOString(),
        location: data.location || '',
        method: data.method || 'personal',
        status: data.status || 'reached',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, record);
      logger.info(`🌱 Soul recorded: ${record.name} by ${data.userId}`);
      return { id, ...record };
    } catch (error) {
      logger.error('Error creating soul:', error);
      throw error;
    }
  }

  /**
   * Get soul by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Get all souls won by a user (sorted newest first)
   */
  static async getByUser(userId) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'userId', operator: '==', value: userId }]
      );

      return results.sort((a, b) => {
        const aT = new Date(a.dateWon || a.createdAt).getTime();
        const bT = new Date(b.dateWon || b.createdAt).getTime();
        return bT - aT;
      });
    } catch (error) {
      logger.error('Error getting souls by user:', error);
      throw error;
    }
  }

  /**
   * Get soul counts for a user (total, this month, this week)
   */
  static async getStats(userId) {
    const souls = await this.getByUser(userId);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const byStatus = {};
    souls.forEach((s) => {
      const st = s.status || 'reached';
      byStatus[st] = (byStatus[st] || 0) + 1;
    });

    return {
      total: souls.length,
      thisMonth: souls.filter((s) => new Date(s.dateWon || s.createdAt) >= monthStart).length,
      thisWeek: souls.filter((s) => new Date(s.dateWon || s.createdAt) >= weekStart).length,
      byStatus,
    };
  }

  /**
   * Update a soul
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete a soul
   */
  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  /**
   * Count souls for a user (used for badge checking)
   */
  static async countByUser(userId) {
    const souls = await this.getByUser(userId);
    return souls.length;
  }

  /**
   * Count souls won by a specific team (users in a team)
   */
  static async countByUsers(userIds) {
    if (!userIds || userIds.length === 0) return 0;
    let total = 0;
    for (const uid of userIds) {
      total += await this.countByUser(uid);
    }
    return total;
  }
}

module.exports = Soul;