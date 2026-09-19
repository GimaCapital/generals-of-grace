// backend/src/models/Rank.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'ranks';

class Rank {
  static async create(data) {
    try {
      const name = data.name?.trim();
      if (!name) throw new Error('Name is required');

      // ✅ Prevent duplicate names
      const all = await this.getAll();
      const dup = all.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      if (dup) {
        const err = new Error(`A rank named "${dup.name}" already exists`);
        err.code = 'DUPLICATE';
        throw err;
      }

      const rank = {
        name,
        description: data.description || '',
        pointsRequired: Number(data.pointsRequired) || 0,
        icon: data.icon || '⭐',
        color: data.color || '#6B7280',
        order: Number(data.order) || 99,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docId = await Database.createDoc(COLLECTION, rank);
      logger.info(`🏆 Rank created: ${rank.name}`);
      return { docId, ...rank };
    } catch (error) {
      logger.error('Error creating rank:', error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const ranks = [];
      snapshot.forEach((doc) => ranks.push({ docId: doc.id, ...doc.data() }));
      return ranks.sort(
        (a, b) => (a.pointsRequired || 0) - (b.pointsRequired || 0)
      );
    } catch (error) {
      logger.error('Error getting ranks:', error);
      throw error;
    }
  }

  static async getActive() {
    const all = await this.getAll();
    return all.filter((r) => r.active !== false);
  }

  static async getById(docId) {
    return Database.getDoc(COLLECTION, docId);
  }

  static async update(docId, data) {
    try {
      // ✅ Prevent renaming into a duplicate
      if (data.name) {
        const name = data.name.trim();
        const all = await this.getAll();
        const dup = all.find(
          (r) =>
            r.name.toLowerCase() === name.toLowerCase() && r.docId !== docId
        );
        if (dup) {
          const err = new Error(`A rank named "${dup.name}" already exists`);
          err.code = 'DUPLICATE';
          throw err;
        }
        data.name = name;
      }

      return Database.updateDoc(COLLECTION, docId, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error updating rank:', error.message);
      throw error;
    }
  }

  static async delete(docId) {
    return Database.deleteDoc(COLLECTION, docId);
  }
}

module.exports = Rank;