// backend/src/controllers/settingsController.js
const Settings = require('../models/Settings');
const { logger } = require('../utils/logger');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const data = req.body;
    
    // ✅ Log what's being received
    logger.info('📥 Updating settings:', data);
    
    const settings = await Settings.update(data);
    
    // ✅ Log what was saved
    logger.info('✅ Settings updated:', settings);
    
    res.json({
      success: true,
      data: settings,
      message: 'Settings saved successfully!'
    });
  } catch (error) {
    logger.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating settings',
    });
  }
};