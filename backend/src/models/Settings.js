// backend/src/models/Settings.js
const Database = require('../config/database');
// const { logger } = require('../utils/logger');

const COLLECTION = 'settings';
const DOCUMENT_ID = 'app_settings';

class Settings {
  static getBaseStructure() {
    return {
      soulsToPoints: 10,
    };
  }

  /**
   * ✅ Flatten nested data - removes any 'data' field
   */
  static flattenData(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const result = { ...obj };

    // ✅ If there's a 'data' field, flatten it
    if (result.data && typeof result.data === 'object') {
      const nested = result.data;
      delete result.data;
      const flattenedNested = this.flattenData(nested);
      Object.assign(result, flattenedNested);
    }

    // ✅ Clean up any Firestore timestamp objects
    for (const key in result) {
      if (
        result[key] &&
        typeof result[key] === 'object' &&
        result[key]._seconds !== undefined
      ) {
        const seconds = result[key]._seconds || 0;
        const nanos = result[key]._nanoseconds || 0;
        result[key] = new Date(seconds * 1000 + nanos / 1000000).toISOString();
      }
    }

    return result;
  }

  static async get() {
    try {
      // ✅ Get document with fixed ID - prevents duplicates
      let doc = await Database.getDoc(COLLECTION, DOCUMENT_ID);

      if (!doc) {
        // ✅ Only create if it doesn't exist - using createDocWithId
        const defaults = {
          ...this.getBaseStructure(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await Database.createDocWithId(COLLECTION, DOCUMENT_ID, defaults);
        // logger.info(`✅ Settings document created with ID: ${DOCUMENT_ID}`);
        return { id: DOCUMENT_ID, ...defaults };
      }

      // ✅ Flatten any nested data
      let data = this.flattenData(doc);

      // ✅ Merge in defaults so soulsToPoints is always present
      return {
        id: DOCUMENT_ID,
        ...this.getBaseStructure(),
        ...data,
      };
    } catch (error) {
      // logger.error('Error getting settings:', error);
      throw error;
    }
  }

  static async update(data) {
    try {
      // ✅ Flatten incoming data first
      const flattenedData = this.flattenData(data);

      // ✅ Get existing document
      let existingData = await Database.getDoc(COLLECTION, DOCUMENT_ID);

      if (!existingData) {
        // ✅ Create if it doesn't exist - using createDocWithId
        const defaults = {
          ...this.getBaseStructure(),
          ...flattenedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await Database.createDocWithId(COLLECTION, DOCUMENT_ID, defaults);
        // logger.info(`✅ Settings document created in update with ID: ${DOCUMENT_ID}`);
        return { id: DOCUMENT_ID, ...defaults };
      }

      // ✅ Flatten existing data
      existingData = this.flattenData(existingData);

      // ✅ Merge: Keep ALL fields
      const mergedData = {
        ...this.getBaseStructure(),
        ...existingData,
        ...flattenedData,
        updatedAt: new Date().toISOString(),
      };

      // ✅ Preserve createdAt
      if (!mergedData.createdAt && existingData.createdAt) {
        mergedData.createdAt = existingData.createdAt;
      } else if (!mergedData.createdAt) {
        mergedData.createdAt = new Date().toISOString();
      }

      // ✅ Update the document with fixed ID
      await Database.updateDoc(COLLECTION, DOCUMENT_ID, mergedData);

      // logger.info(`✅ Settings updated (${Object.keys(flattenedData).length} fields changed)`);
      return { id: DOCUMENT_ID, ...mergedData };
    } catch (error) {
      // logger.error('Error updating settings:', error);
      throw error;
    }
  }

  static deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}

module.exports = Settings;