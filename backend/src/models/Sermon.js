// backend/src/models/Sermon.js
const Database = require('../config/database');
const { slugify, generateId } = require('../utils/helpers');
const { logger } = require('../utils/logger');

const COLLECTION = 'sermons';

class Sermon {
  /**
   * Create a new sermon
   */
  static async create(sermonData) {
    try {
      const data = {
        ...sermonData,
        slug: sermonData.slug || slugify(sermonData.title),
        sermonId: generateId(10),
        views: 0,
        likes: 0,
        shares: 0,
        downloads: 0,
        status: sermonData.status || 'draft',
        isLive: sermonData.isLive || false,
        categories: sermonData.categories || [],
        tags: sermonData.tags || [],
        scripture: sermonData.scripture || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
      logger.info(`📖 Sermon created: ${data.title} (${id})`);
      return { id, ...data };
    } catch (error) {
      logger.error('Error creating sermon:', error);
      throw error;
    }
  }

  /**
   * Get sermon by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Get sermon by slug
   */
  static async getBySlug(slug) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'slug', operator: '==', value: slug }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting sermon by slug:', error);
      throw error;
    }
  }

  /**
   * Update sermon
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, data);
  }

  /**
   * Delete sermon
   */
  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  /**
   * Get all sermons (paginated)
   */
  static async getAll(page = 1, limit = 20, filters = [], search = '') {
    try {
      let query = Database.getCollection(COLLECTION);
      
      for (const filter of filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }

      const totalSnapshot = await query.count().get();
      const total = totalSnapshot.data().count;

      query = query.orderBy('date', 'desc');

      const offset = (page - 1) * limit;
      const snapshot = await query
        .limit(limit)
        .offset(offset)
        .get();

      const results = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (search) {
          const searchLower = search.toLowerCase();
          if (!data.title.toLowerCase().includes(searchLower) &&
              !data.speaker?.toLowerCase().includes(searchLower) &&
              !data.description?.toLowerCase().includes(searchLower)) {
            return;
          }
        }
        results.push({ id: doc.id, ...data });
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
      logger.error('Error getting sermons:', error);
      throw error;
    }
  }

  /**
   * Get published sermons
   */
  static async getPublished(page = 1, limit = 20, filters = []) {
    return this.getAll(page, limit, [
      ...filters,
      { field: 'status', operator: '==', value: 'published' },
    ]);
  }

  /**
   * ✅ FIXED - Get live sermon (simplified, no complex index needed)
   */
  static async getLive() {
    try {
      // ✅ Simple query - only filter by isLive
      const snapshot = await Database.getCollection(COLLECTION)
        .where('isLive', '==', true)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      // ✅ Return the sermon with id
      return { id: doc.id, ...data };
    } catch (error) {
      logger.error('Error getting live sermon:', error);
      return null;
    }
  }

  /**
   * Increment view count
   */
  static async incrementViews(id) {
    return Database.incrementField(COLLECTION, id, 'views');
  }

  /**
   * Increment like count
   */
  static async incrementLikes(id) {
    return Database.incrementField(COLLECTION, id, 'likes');
  }

  /**
   * Get recent sermons
   */
  static async getRecent(limit = 10) {
    const results = await this.getPublished(1, limit);
    return results.data;
  }

  /**
   * Get popular sermons
   */
  static async getPopular(limit = 10) {
    try {
      const snapshot = await Database.getCollection(COLLECTION)
        .where('status', '==', 'published')
        .orderBy('views', 'desc')
        .limit(limit)
        .get();

      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (error) {
      logger.error('Error getting popular sermons:', error);
      throw error;
    }
  }

  /**
   * Get sermon categories
   */
  static async getCategories() {
    try {
      const snapshot = await Database.getCollection(COLLECTION)
        .where('status', '==', 'published')
        .select('categories')
        .get();

      const categories = new Set();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.categories) {
          data.categories.forEach(cat => categories.add(cat));
        }
      });
      return Array.from(categories).sort();
    } catch (error) {
      logger.error('Error getting sermon categories:', error);
      throw error;
    }
  }
}

module.exports = Sermon;