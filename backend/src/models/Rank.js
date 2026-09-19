// backend/src/models/Rank.js
const Database = require('../config/database');
const Settings = require('./Settings');
const { logger } = require('../utils/logger');

const COLLECTION = 'ranks';

/**
 * Safety net — used only if Settings can't be read or returns an invalid value.
 * The real value lives in Firestore and is controlled by admins via /admin/settings.
 */
const FALLBACK_SOULS_TO_POINTS = 10;

/**
 * Read soulsToPoints from Settings (Firestore) — dynamic, admin-controlled
 */
async function getSoulsToPoints() {
  try {
    const settings = await Settings.get();
    const ratio = Number(settings?.soulsToPoints);
    if (Number.isFinite(ratio) && ratio > 0) {
      return ratio;                       // ✅ Use the admin-configured value
    }
    return FALLBACK_SOULS_TO_POINTS;      // ⚠️  Only if invalid
  } catch (error) {
    logger.error('Error reading soulsToPoints:', error.message);
    return FALLBACK_SOULS_TO_POINTS;      // ⚠️  Only if Settings read fails
  }
}

class Rank {
  static async create(data) {
    try {
      const name = data.name?.trim();
      if (!name) throw new Error('Name is required');

      const all = await this.getAll();
      const dup = all.find((r) => r.name.toLowerCase() === name.toLowerCase());
      if (dup) {
        const err = new Error(`A rank named "${dup.name}" already exists`);
        err.code = 'DUPLICATE';
        throw err;
      }

      const soulsToPoints = await getSoulsToPoints();

      let pointsRequired;
      if (data.pointsRequired !== undefined) {
        pointsRequired = Number(data.pointsRequired) || 0;
      } else if (data.soulsRequired !== undefined) {
        pointsRequired = (Number(data.soulsRequired) || 0) * soulsToPoints;
      } else {
        pointsRequired = 0;
      }

      const rank = {
        name,
        description: data.description || '',
        pointsRequired,
        soulsRequired: Math.round(pointsRequired / soulsToPoints),
        icon: data.icon || '⭐',
        color: data.color || '#6B7280',
        order: Number(data.order) || 99,
        active: data.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docId = await Database.createDoc(COLLECTION, rank);
      logger.info(
        `🏆 Rank created: ${rank.name} (${rank.pointsRequired} pts / ${rank.soulsRequired} souls)`
      );
      return { docId, ...rank };
    } catch (error) {
      logger.error('Error creating rank:', error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const soulsToPoints = await getSoulsToPoints();
      const snapshot = await Database.getCollection(COLLECTION).get();
      const ranks = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ranks.push({
          docId: doc.id,
          ...data,
          soulsRequired:
            data.soulsRequired !== undefined
              ? data.soulsRequired
              : Math.round((data.pointsRequired || 0) / soulsToPoints),
        });
      });
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

      const soulsToPoints = await getSoulsToPoints();

      if (data.pointsRequired !== undefined) {
        data.pointsRequired = Number(data.pointsRequired) || 0;
        data.soulsRequired = Math.round(data.pointsRequired / soulsToPoints);
      } else if (data.soulsRequired !== undefined) {
        data.soulsRequired = Number(data.soulsRequired) || 0;
        data.pointsRequired = data.soulsRequired * soulsToPoints;
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