// backend/src/models/User.js
const Database = require('../config/database');
const { generateTitheNumber } = require('../utils/helpers');
const { logger } = require('../utils/logger');

const COLLECTION = 'users';

class User {
  /**
   * Create a new user
   */
  static async create(userData) {
    try {
      const data = {
        ...userData,
        titheNumber: userData.titheNumber || generateTitheNumber('GOG'),
        role: userData.role || 'member',
        isActive: true,
        isVerified: false,
        preferences: {
          notifications: true,
          language: 'en',
        },
        stats: {
          totalGiven: 0,
          totalEventsAttended: 0,
          totalSermonsWatched: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
      logger.info(`👤 User created: ${data.email} (${id})`);
      return { id, ...data };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Get user by email
   */
  static async getByEmail(email) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'email', operator: '==', value: email }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Get user by tithe number
   */
  static async getByTitheNumber(titheNumber) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'titheNumber', operator: '==', value: titheNumber }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting user by tithe number:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, data);
  }

  /**
   * Delete user
   */
  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  /**
   * Get all users (paginated)
   */
  static async getAll(page = 1, limit = 20, filters = []) {
    return Database.getPaginated(
      COLLECTION,
      filters,
      { field: 'createdAt', direction: 'desc' },
      page,
      limit
    );
  }

  /**
   * ✅ NEW: Get all users as a flat array (for admin dashboard)
   */
  static async getAllUsersFlat() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (error) {
      logger.error('Error getting all users (flat):', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  static async updateRole(id, role) {
    return Database.updateDoc(COLLECTION, id, { role });
  }

  /**
   * Increment user stats
   */
  static async incrementStats(id, field, value = 1) {
    const validFields = ['totalGiven', 'totalEventsAttended', 'totalSermonsWatched'];
    if (!validFields.includes(field)) {
      throw new Error(`Invalid stat field: ${field}`);
    }
    return Database.incrementField(COLLECTION, id, `stats.${field}`, value);
  }

  /**
   * Update user giving total
   */
  static async updateTotalGiven(id, amount) {
    return Database.incrementField(COLLECTION, id, 'stats.totalGiven', amount);
  }

  /**
   * Get user stats
   */
  static async getStats(id) {
    const user = await this.getById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.stats || {};
  }
}

module.exports = User;