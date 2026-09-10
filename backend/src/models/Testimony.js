// backend/src/models/Testimony.js
const Database = require('../config/database');
const { generateId } = require('../utils/helpers');
const { logger } = require('../utils/logger');

const COLLECTION = 'testimonies';

class Testimony {
  static async create(testimonyData) {
    try {
      const data = {
        ...testimonyData,
        testimonyId: generateId(10),
        status: testimonyData.status || 'pending',
        likes: 0,
        featured: testimonyData.featured || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
      logger.info(`🙏 Testimony created: ${data.name} (${id})`);
      return { id, ...data };
    } catch (error) {
      logger.error('Error creating testimony:', error);
      throw error;
    }
  }

  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  static async update(id, data) {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    return Database.updateDoc(COLLECTION, id, updateData);
  }

  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  // ✅ FIXED: Safe sorting that handles any data type
  static async getAll(filters = [], sort = { field: 'createdAt', direction: 'desc' }, limit = null) {
    try {
      let query = Database.getCollection(COLLECTION);
      
      // Apply filters
      for (const filter of filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }
      
      const snapshot = await query.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      // ✅ SAFE SORT - handles strings, numbers, dates, nulls
      results.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];
        
        // Handle null/undefined
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        // Handle strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'desc' 
            ? bValue.localeCompare(aValue) 
            : aValue.localeCompare(bValue);
        }
        
        // Handle numbers/dates (fallback)
        if (sort.direction === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
      
      // Apply limit
      if (limit) {
        return results.slice(0, limit);
      }
      
      return results;
    } catch (error) {
      logger.error('Error getting testimonies:', error);
      return [];
    }
  }

  static async getApproved(limit = 10) {
    try {
      const results = await this.getAll(
        [{ field: 'status', operator: '==', value: 'approved' }],
        { field: 'createdAt', direction: 'desc' },
        limit
      );
      return results;
    } catch (error) {
      logger.error('Error getting approved testimonies:', error);
      return [];
    }
  }

  static async getFeatured(limit = 5) {
    try {
      const results = await this.getAll(
        [
          { field: 'status', operator: '==', value: 'approved' },
          { field: 'featured', operator: '==', value: true }
        ],
        { field: 'createdAt', direction: 'desc' },
        limit
      );
      return results;
    } catch (error) {
      logger.error('Error getting featured testimonies:', error);
      return [];
    }
  }

  static async getPending() {
    try {
      const results = await this.getAll(
        [{ field: 'status', operator: '==', value: 'pending' }],
        { field: 'createdAt', direction: 'asc' }
      );
      return results;
    } catch (error) {
      logger.error('Error getting pending testimonies:', error);
      return [];
    }
  }

  static async approve(id) {
    return this.update(id, { 
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
  }

  static async reject(id, reason = '') {
    return this.update(id, { 
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });
  }

  static async toggleFeatured(id, featured) {
    return this.update(id, { featured });
  }

  static async getStats() {
    try {
      const all = await this.getAll();
      const pending = all.filter(t => t.status === 'pending');
      const approved = all.filter(t => t.status === 'approved');
      const rejected = all.filter(t => t.status === 'rejected');
      
      return {
        total: all.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      };
    } catch (error) {
      logger.error('Error getting testimony stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
}

module.exports = Testimony;