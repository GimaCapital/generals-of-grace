const Database = require('../config/database');
const { slugify, generateId } = require('../utils/helpers');
const { logger } = require('../utils/logger');

const COLLECTION = 'ministries';

class Ministry {
  /**
   * Create a new ministry
   */
  static async create(ministryData) {
    try {
      const data = {
        ...ministryData,
        slug: ministryData.slug || slugify(ministryData.name),
        ministryId: generateId(10),
        members: [],
        leaders: [],
        status: ministryData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
      logger.info(`🙏 Ministry created: ${data.name} (${id})`);
      return { id, ...data };
    } catch (error) {
      logger.error('Error creating ministry:', error);
      throw error;
    }
  }

  /**
   * Get ministry by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Get ministry by slug
   */
  static async getBySlug(slug) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'slug', operator: '==', value: slug }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting ministry by slug:', error);
      throw error;
    }
  }

  /**
   * Update ministry
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, data);
  }

  /**
   * Delete ministry
   */
  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  /**
   * Get all ministries
   */
  static async getAll(filters = []) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        filters,
        { field: 'name', direction: 'asc' }
      );
      return results;
    } catch (error) {
      logger.error('Error getting ministries:', error);
      throw error;
    }
  }

  /**
   * Get active ministries
   */
  static async getActive() {
    return this.getAll([
      { field: 'status', operator: '==', value: 'active' },
    ]);
  }

  /**
   * Add member to ministry
   */
  static async addMember(id, userId, role = 'member') {
    try {
      const ministry = await this.getById(id);
      if (!ministry) {
        throw new Error('Ministry not found');
      }

      if (ministry.members?.includes(userId)) {
        throw new Error('Already a member of this ministry');
      }

      await Database.updateDoc(COLLECTION, id, {
        members: Database.FieldValue.arrayUnion(userId),
        [`memberRoles.${userId}`]: role,
      });

      logger.info(`👤 User ${userId} joined ministry ${id}`);
      return true;
    } catch (error) {
      logger.error('Error adding member to ministry:', error);
      throw error;
    }
  }

  /**
   * Remove member from ministry
   */
  static async removeMember(id, userId) {
    try {
      const ministry = await this.getById(id);
      if (!ministry) {
        throw new Error('Ministry not found');
      }

      if (!ministry.members?.includes(userId)) {
        throw new Error('Not a member of this ministry');
      }

      await Database.updateDoc(COLLECTION, id, {
        members: Database.FieldValue.arrayRemove(userId),
        [`memberRoles.${userId}`]: Database.FieldValue.delete(),
      });

      logger.info(`👤 User ${userId} left ministry ${id}`);
      return true;
    } catch (error) {
      logger.error('Error removing member from ministry:', error);
      throw error;
    }
  }
}

module.exports = Ministry;