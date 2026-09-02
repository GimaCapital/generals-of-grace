// backend/src/models/Event.js
const Database = require('../config/database');
const { slugify, generateId } = require('../utils/helpers');
const { logger } = require('../utils/logger');

const COLLECTION = 'events';

class Event {
  /**
   * Create a new event
   */
  static async create(eventData) {
    try {
      const data = {
        ...eventData,
        slug: eventData.slug || slugify(eventData.title),
        eventId: generateId(10),
        registeredCount: 0,
        attendees: [],
        status: eventData.status || 'upcoming',
        type: eventData.type || 'service',
        registrationRequired: eventData.registrationRequired || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await Database.createDoc(COLLECTION, data);
      logger.info(`📅 Event created: ${data.title} (${id})`);
      return { id, ...data };
    } catch (error) {
      logger.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Get event by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Get event by slug
   */
  static async getBySlug(slug) {
    try {
      const results = await Database.getDocs(
        COLLECTION,
        [{ field: 'slug', operator: '==', value: slug }]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting event by slug:', error);
      throw error;
    }
  }

  /**
   * Update event
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, data);
  }

  /**
   * Delete event
   */
  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  /**
   * Get all events (paginated)
   */
  static async getAll(page = 1, limit = 20, filters = []) {
    return Database.getPaginated(
      COLLECTION,
      filters,
      { field: 'date', direction: 'asc' },
      page,
      limit
    );
  }

  /**
   * ✅ Get all events for homepage (NO FILTERS)
   */
  static async getUpcoming(limit = 6) {
    try {
      // ✅ Get ALL events sorted by date
      const snapshot = await Database.getCollection(COLLECTION)
        .orderBy('date', 'asc')
        .limit(limit)
        .get();

      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`📅 Found ${results.length} total events for homepage`);
      return results;
    } catch (error) {
      logger.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Register for event
   */
  static async register(id, userId, userData) {
    try {
      const event = await this.getById(id);
      if (!event) {
        throw new Error('Event not found');
      }

      if (event.capacity && event.registeredCount >= event.capacity) {
        throw new Error('Event is fully booked');
      }

      if (event.attendees?.includes(userId)) {
        throw new Error('Already registered for this event');
      }

      await Database.updateDoc(COLLECTION, id, {
        registeredCount: Database.FieldValue.increment(1),
        attendees: Database.FieldValue.arrayUnion(userId),
      });

      logger.info(`📅 User ${userId} registered for event ${id}`);
      return true;
    } catch (error) {
      logger.error('Error registering for event:', error);
      throw error;
    }
  }

  /**
   * Cancel registration
   */
  static async cancelRegistration(id, userId) {
    try {
      const event = await this.getById(id);
      if (!event) {
        throw new Error('Event not found');
      }

      if (!event.attendees?.includes(userId)) {
        throw new Error('Not registered for this event');
      }

      await Database.updateDoc(COLLECTION, id, {
        registeredCount: Database.FieldValue.increment(-1),
        attendees: Database.FieldValue.arrayRemove(userId),
      });

      logger.info(`📅 User ${userId} canceled registration for event ${id}`);
      return true;
    } catch (error) {
      logger.error('Error canceling registration:', error);
      throw error;
    }
  }
}

module.exports = Event;