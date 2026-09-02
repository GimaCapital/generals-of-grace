// backend/src/models/Settings.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');

const COLLECTION = 'settings';

class Settings {
  static async get() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).limit(1).get();
      if (snapshot.empty) {
        const defaults = {
          siteName: 'Generals of Grace Intl Church',
          siteEmail: 'info@generalsofgrace.org',
          sitePhone: '+234 800 000 0000',
          siteAddress: '123 Church Road, Port Harcourt, Rivers State, Nigeria',
          enableRegistration: true,
          enableGiving: true,
          enableLiveStream: true,
          theme: 'light',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        // ✅ Create the default document
        const id = await Database.createDoc(COLLECTION, defaults);
        return { id, ...defaults };
      }
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      // ✅ Return clean data without duplicates
      return { 
        id: doc.id, 
        siteName: data.siteName || 'Generals of Grace Intl Church',
        siteEmail: data.siteEmail || 'info@generalsofgrace.org',
        sitePhone: data.sitePhone || '+234 800 000 0000',
        siteAddress: data.siteAddress || '123 Church Road, Port Harcourt, Rivers State, Nigeria',
        enableRegistration: data.enableRegistration !== undefined ? data.enableRegistration : true,
        enableGiving: data.enableGiving !== undefined ? data.enableGiving : true,
        enableLiveStream: data.enableLiveStream !== undefined ? data.enableLiveStream : true,
        theme: data.theme || 'light',
        notifications: {
          email: data.notifications?.email !== undefined ? data.notifications.email : true,
          sms: data.notifications?.sms !== undefined ? data.notifications.sms : false,
          push: data.notifications?.push !== undefined ? data.notifications.push : true
        },
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting settings:', error);
      throw error;
    }
  }

  static async update(data) {
    try {
      // ✅ Clean the data before saving - remove any duplicate fields
      const cleanData = {
        siteName: data.siteName || 'Generals of Grace Intl Church',
        siteEmail: data.siteEmail || 'info@generalsofgrace.org',
        sitePhone: data.sitePhone || '+234 800 000 0000',
        siteAddress: data.siteAddress || '123 Church Road, Port Harcourt, Rivers State, Nigeria',
        enableRegistration: data.enableRegistration !== undefined ? data.enableRegistration : true,
        enableGiving: data.enableGiving !== undefined ? data.enableGiving : true,
        enableLiveStream: data.enableLiveStream !== undefined ? data.enableLiveStream : true,
        theme: data.theme || 'light',
        notifications: {
          email: data.notifications?.email !== undefined ? data.notifications.email : true,
          sms: data.notifications?.sms !== undefined ? data.notifications.sms : false,
          push: data.notifications?.push !== undefined ? data.notifications.push : true
        },
        updatedAt: new Date().toISOString()
      };

      const snapshot = await Database.getCollection(COLLECTION).limit(1).get();
      let id;
      
      if (snapshot.empty) {
        // ✅ Create new document with clean data
        cleanData.createdAt = new Date().toISOString();
        id = await Database.createDoc(COLLECTION, cleanData);
      } else {
        // ✅ Update existing document - completely replace with clean data
        id = snapshot.docs[0].id;
        // ✅ Keep the original createdAt
        const existingData = snapshot.docs[0].data();
        cleanData.createdAt = existingData.createdAt || new Date().toISOString();
        
        // ✅ Use set with merge to override all fields
        await Database.updateDoc(COLLECTION, id, cleanData);
      }
      
      return { id, ...cleanData };
    } catch (error) {
      logger.error('Error updating settings:', error);
      throw error;
    }
  }
}

module.exports = Settings;