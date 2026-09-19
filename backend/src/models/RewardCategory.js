// backend/src/models/RewardCategory.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'rewardCategories';

class RewardCategory {
  static generateKey(label) {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async findDuplicate(label, key) {
    try {
      const all = await this.getAll();
      return (
        all.find(
          (c) =>
            c.label.toLowerCase() === label.toLowerCase() || c.key === key
        ) || null
      );
    } catch (error) {
      logger.error('Error checking duplicate:', error);
      return null;
    }
  }

  static async create(data) {
    try {
      const label = data.label?.trim();
      if (!label) throw new Error('Label is required');

      const key = data.key?.trim() || this.generateKey(label);

      // ✅ Prevent duplicates
      const existing = await this.findDuplicate(label, key);
      if (existing) {
        const err = new Error(
          `A category named "${existing.label}" already exists`
        );
        err.code = 'DUPLICATE';
        throw err;
      }

      const category = {
        key,
        label,
        description: data.description || '',
        icon: data.icon || '🎁',
        order: Number(data.order) || 99,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docId = await Database.createDoc(COLLECTION, category);
      logger.info(`📁 Reward category created: ${category.label}`);
      return { docId, ...category };
    } catch (error) {
      logger.error('Error creating reward category:', error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const categories = [];
      snapshot.forEach((doc) =>
        categories.push({ docId: doc.id, ...doc.data() })
      );
      return categories.sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (error) {
      logger.error('Error getting reward categories:', error);
      throw error;
    }
  }

  static async getActive() {
    const all = await this.getAll();
    return all.filter((c) => c.active !== false);
  }

  static async getByKey(key) {
    try {
      const results = await Database.getDocs(COLLECTION, [
        { field: 'key', operator: '==', value: key },
      ]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting category by key:', error);
      throw error;
    }
  }

  static async getById(docId) {
    return Database.getDoc(COLLECTION, docId);
  }

  static async update(docId, data) {
    try {
      // ✅ Prevent renaming into a duplicate
      if (data.label) {
        const label = data.label.trim();
        const key = data.key?.trim() || this.generateKey(label);
        const existing = await this.findDuplicate(label, key);

        if (existing && existing.docId !== docId) {
          const err = new Error(
            `A category named "${existing.label}" already exists`
          );
          err.code = 'DUPLICATE';
          throw err;
        }

        data.label = label;
        data.key = key;
      }

      return Database.updateDoc(COLLECTION, docId, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error updating reward category:', error.message);
      throw error;
    }
  }

  static async delete(docId) {
    return Database.deleteDoc(COLLECTION, docId);
  }
}

module.exports = RewardCategory;