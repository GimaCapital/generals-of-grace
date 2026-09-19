// backend/src/models/Reward.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'rewards';

class Reward {
  static async create(data) {
    try {
      const title = data.title?.trim();
      if (!title) throw new Error('Title is required');
      if (!data.category) throw new Error('Category is required');

      // ✅ Prevent duplicates within the same category
      const all = await this.getAll();
      const dup = all.find(
        (r) =>
          r.title.toLowerCase() === title.toLowerCase() &&
          r.category === data.category
      );
      if (dup) {
        const err = new Error(
          `A reward named "${dup.title}" already exists in this category`
        );
        err.code = 'DUPLICATE';
        throw err;
      }

      const reward = {
        title,
        description: data.description || '',
        category: data.category,
        soulsRequired: Number(data.soulsRequired) || 1,
        icon: data.icon || '🏅',
        order: Number(data.order) || 99,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docId = await Database.createDoc(COLLECTION, reward);
      logger.info(`🎁 Reward created: ${reward.title}`);
      return { docId, ...reward };
    } catch (error) {
      logger.error('Error creating reward:', error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const rewards = [];
      snapshot.forEach((doc) =>
        rewards.push({ docId: doc.id, ...doc.data() })
      );
      return rewards.sort((a, b) => {
        if (a.category !== b.category)
          return a.category.localeCompare(b.category);
        return (a.order || 99) - (b.order || 99);
      });
    } catch (error) {
      logger.error('Error getting rewards:', error);
      throw error;
    }
  }

  static async getActive() {
    const all = await this.getAll();
    return all.filter((r) => r.active !== false);
  }

  static async getActiveGrouped() {
    const RewardCategory = require('./RewardCategory');
    const [all, categories] = await Promise.all([
      this.getActive(),
      RewardCategory.getActive(),
    ]);

    const grouped = [];

    categories.forEach((cat) => {
      const catRewards = all
        .filter((r) => r.category === cat.key)
        .sort((a, b) => (a.soulsRequired || 0) - (b.soulsRequired || 0));

      grouped.push({
        key: cat.key,
        label: cat.label,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        rewards: catRewards,
      });
    });

    // Orphaned rewards (their category was deleted)
    const activeCategoryKeys = categories.map((c) => c.key);
    const orphaned = all.filter((r) => !activeCategoryKeys.includes(r.category));
    if (orphaned.length > 0) {
      grouped.push({
        key: 'other',
        label: 'Other',
        description: 'Additional rewards',
        icon: '🎁',
        order: 999,
        rewards: orphaned.sort(
          (a, b) => (a.soulsRequired || 0) - (b.soulsRequired || 0)
        ),
      });
    }

    return grouped;
  }

  static async getById(docId) {
    return Database.getDoc(COLLECTION, docId);
  }

  static async update(docId, data) {
    try {
      // ✅ Prevent renaming into a duplicate
      if (data.title && data.category) {
        const title = data.title.trim();
        const all = await this.getAll();
        const dup = all.find(
          (r) =>
            r.title.toLowerCase() === title.toLowerCase() &&
            r.category === data.category &&
            r.docId !== docId
        );
        if (dup) {
          const err = new Error(
            `A reward named "${dup.title}" already exists in this category`
          );
          err.code = 'DUPLICATE';
          throw err;
        }
        data.title = title;
      }

      return Database.updateDoc(COLLECTION, docId, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error updating reward:', error.message);
      throw error;
    }
  }

  static async delete(docId) {
    return Database.deleteDoc(COLLECTION, docId);
  }
}

module.exports = Reward;