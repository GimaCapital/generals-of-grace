// backend/src/models/Giving.js
const Database = require('../config/database');
const { generateTitheNumber } = require('../utils/helpers');
const { logger } = require('../utils/logger');

const COLLECTION = 'giving';

class Giving {
  /**
   * Create a new giving record
   */
  static async create(givingData) {
    try {
      const data = {
        ...givingData,
        titheNumber: givingData.titheNumber || generateTitheNumber('GOG'),
        status: givingData.status || 'pending',
        paymentMethod: givingData.paymentMethod || 'flutterwave',
        reference: givingData.reference || `GOG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
      logger.info(`💰 Giving record created: ${data.reference} (${id})`);
      return { id, ...data };
    } catch (error) {
      logger.error('Error creating giving record:', error);
      throw error;
    }
  }

  /**
   * Get giving record by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Get giving record by reference
   */
  static async getByReference(reference) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'reference', operator: '==', value: reference }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting giving by reference:', error);
      throw error;
    }
  }

  /**
   * Get giving record by Flutterwave reference
   */
  static async getByFlutterwaveRef(flutterwaveRef) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'flutterwaveRef', operator: '==', value: flutterwaveRef }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting giving by Flutterwave ref:', error);
      throw error;
    }
  }

  /**
   * Update giving record
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, data);
  }

  /**
   * Get giving records by user
   */
  static async getByUserId(userId, page = 1, limit = 20) {
    try {
      const snapshot = await Database.getCollection(COLLECTION)
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .limit(limit)
        .offset((page - 1) * limit)
        .get();
      
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      const countSnapshot = await Database.getCollection(COLLECTION)
        .where('userId', '==', userId)
        .count()
        .get();
      
      const total = countSnapshot.data().count || data.length;
      
      return {
        data: data,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting giving by userId:', error);
      return { 
        data: [], 
        pagination: { page: 1, limit: 20, total: 0, pages: 0 } 
      };
    }
  }

  /**
   * Get giving stats - SHOW ALL STATUSES
   */
  static async getStats(year = null) {
    try {
      let query = Database.getCollection(COLLECTION);

      if (year) {
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year, 11, 31).toISOString();
        query = query.where('date', '>=', startDate)
                     .where('date', '<=', endDate);
      }

      const snapshot = await query.get();
      
      const stats = {
        total: 0,
        count: 0,
        byType: {},
        byMonth: {},
        byCurrency: {},
        byStatus: {},
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        stats.total += data.amount || 0;
        stats.count += 1;

        stats.byType[data.type] = (stats.byType[data.type] || 0) + (data.amount || 0);
        
        const status = data.status || 'pending';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

        const currency = data.currency || 'NGN';
        stats.byCurrency[currency] = (stats.byCurrency[currency] || 0) + (data.amount || 0);

        const date = new Date(data.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + (data.amount || 0);
      });

      return stats;
    } catch (error) {
      logger.error('Error getting giving stats:', error);
      throw error;
    }
  }

  /**
   * Get user total giving - SHOW ALL STATUSES
   */
  static async getUserTotal(userId) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [
          { field: 'userId', operator: '==', value: userId },
        ]
      );

      let total = 0;
      results.forEach(record => {
        total += record.amount || 0;
      });
      return total;
    } catch (error) {
      logger.error('Error getting user total giving:', error);
      throw error;
    }
  }

  /**
   * Get all giving records - SHOW ALL (Admin only)
   */
  static async getAllGiving(page = 1, limit = 20) {
    try {
      const results = await Database.getPaginated(
        COLLECTION,
        [],
        { field: 'date', direction: 'desc' },
        page,
        limit
      );
      return results;
    } catch (error) {
      logger.error('Error getting all giving:', error);
      return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
    }
  }

  /**
   * ✅ NEW: Get ALL giving stats (no user filter) - for admin dashboard
   */
  static async getAllStats(year = null) {
    try {
      let query = Database.getCollection(COLLECTION);

      if (year) {
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year, 11, 31).toISOString();
        query = query.where('date', '>=', startDate)
                     .where('date', '<=', endDate);
      }

      const snapshot = await query.get();
      
      const stats = {
        total: 0,
        count: 0,
        byType: {},
        byStatus: {},
        byMonth: {},
        byCurrency: {},
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        stats.total += data.amount || 0;
        stats.count += 1;
        stats.byType[data.type] = (stats.byType[data.type] || 0) + (data.amount || 0);
        stats.byStatus[data.status || 'pending'] = (stats.byStatus[data.status || 'pending'] || 0) + 1;
        
        const currency = data.currency || 'NGN';
        stats.byCurrency[currency] = (stats.byCurrency[currency] || 0) + (data.amount || 0);

        const date = new Date(data.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + (data.amount || 0);
      });

      return stats;
    } catch (error) {
      logger.error('Error getting all stats:', error);
      throw error;
    }
  }

  /**
   * Mark payment as successful
   */
  static async markSuccessful(id, transactionData) {
    return Database.updateDoc(COLLECTION, id, {
      status: 'successful',
      paidAt: new Date().toISOString(),
      transactionData,
    });
  }

  /**
   * Mark payment as failed
   */
  static async markFailed(id, reason) {
    return Database.updateDoc(COLLECTION, id, {
      status: 'failed',
      failedAt: new Date().toISOString(),
      failureReason: reason,
    });
  }
}

module.exports = Giving;