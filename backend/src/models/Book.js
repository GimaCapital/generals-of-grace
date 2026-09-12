// backend/src/models/Book.js
const Database = require('../config/database');
const { slugify, generateId } = require('../utils/helpers');
// const { logger } = require('../utils/logger');

const COLLECTION = 'books';

class Book {
  static async create(bookData) {
    try {
      const data = {
        ...bookData,
        slug: bookData.slug || slugify(bookData.title),
        bookId: generateId(10),
        status: bookData.status || 'published',
        featured: bookData.featured || false,
        price: Number(bookData.price) || 0,
        pages: Number(bookData.pages) || 0,
        reviews: bookData.reviews || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
    //   logger.info(`📚 Book created: ${data.title} (${id})`);
      return { id, ...data };
    } catch (error) {
    //   logger.error('Error creating book:', error);
      throw error;
    }
  }

  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  static async getBySlug(slug) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'slug', operator: '==', value: slug }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
    //   logger.error('Error getting book by slug:', error);
      throw error;
    }
  }

  static async update(id, data) {
    const updateData = {
      ...data,
      price: data.price ? Number(data.price) : undefined,
      pages: data.pages ? Number(data.pages) : undefined,
      updatedAt: new Date().toISOString(),
    };
    return Database.updateDoc(COLLECTION, id, updateData);
  }

  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  static async getAll(filters = [], limit = null) {
    try {
      let query = Database.getCollection(COLLECTION);
      
      for (const filter of filters) {
        query = query.where(filter.field, filter.operator, filter.value);
      }
      
      const snapshot = await query.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      // ✅ FIX: Sort by createdAt using Firestore Timestamp seconds
      results.sort((a, b) => {
        const aTime = a.createdAt?._seconds || a.createdAt?.seconds || 0;
        const bTime = b.createdAt?._seconds || b.createdAt?.seconds || 0;
        return bTime - aTime; // Newest first
      });
      
      if (limit) return results.slice(0, limit);
      return results;
    } catch (error) {
    //   logger.error('Error getting books:', error);
      return [];
    }
  }

  static async getPublished(limit = null) {
    return this.getAll(
      [{ field: 'status', operator: '==', value: 'published' }],
      limit
    );
  }

  static async getFeatured(limit = 3) {
    return this.getAll(
      [
        { field: 'status', operator: '==', value: 'published' },
        { field: 'featured', operator: '==', value: true }
      ],
      limit
    );
  }

  static async getComingSoon() {
    return this.getAll([
      { field: 'status', operator: '==', value: 'coming_soon' }
    ]);
  }
}

module.exports = Book;