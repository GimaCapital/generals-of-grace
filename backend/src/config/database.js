const { db, FieldValue, Timestamp } = require('./firebase');
const { logger } = require('../utils/logger');

/**
 * Database helpers for Firestore operations
 */
class Database {
  /**
   * Get a document by ID
   */
  static async getDoc(collection, id) {
    try {
      const doc = await db.collection(collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error getting document ${collection}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents in a collection
   */
  static async getDocs(collection, filters = [], orderBy = null, limit = null) {
    try {
      let query = db.collection(collection);
      
      for (const filter of filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }
      
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const snapshot = await query.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      return results;
    } catch (error) {
      logger.error(`Error getting documents from ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Create a new document
   */
  static async createDoc(collection, data) {
    try {
      const docRef = await db.collection(collection).add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      logger.error(`Error creating document in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  static async updateDoc(collection, id, data) {
    try {
      await db.collection(collection).doc(id).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return true;
    } catch (error) {
      logger.error(`Error updating document ${collection}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  static async deleteDoc(collection, id) {
    try {
      await db.collection(collection).doc(id).delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting document ${collection}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Increment a field value
   */
  static async incrementField(collection, id, field, value = 1) {
    try {
      await db.collection(collection).doc(id).update({
        [field]: FieldValue.increment(value),
      });
      return true;
    } catch (error) {
      logger.error(`Error incrementing field ${collection}/${id}/${field}:`, error);
      throw error;
    }
  }

  /**
   * Get paginated results
   */
  static async getPaginated(collection, filters = [], orderBy = null, page = 1, limit = 10) {
    try {
      let query = db.collection(collection);
      
      for (const filter of filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }
      
      const totalSnapshot = await query.count().get();
      const total = totalSnapshot.data().count;
      
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }
      
      const offset = (page - 1) * limit;
      
      const snapshot = await query
        .limit(limit)
        .offset(offset)
        .get();
      
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      return {
        data: results,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error getting paginated results from ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Batch write operations
   */
  static async batchWrite(operations) {
    try {
      const batch = db.batch();
      
      for (const op of operations) {
        const docRef = db.collection(op.collection).doc(op.id);
        if (op.type === 'set') {
          batch.set(docRef, op.data, { merge: true });
        } else if (op.type === 'update') {
          batch.update(docRef, op.data);
        } else if (op.type === 'delete') {
          batch.delete(docRef);
        }
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      logger.error('Error performing batch write:', error);
      throw error;
    }
  }

  /**
   * Get a reference to a document
   */
  static getRef(collection, id) {
    return db.collection(collection).doc(id);
  }

  /**
   * Get a collection reference
   */
  static getCollection(collection) {
    return db.collection(collection);
  }
}

module.exports = Database;