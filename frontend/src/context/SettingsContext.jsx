// src/context/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import toast from 'react-hot-toast';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log('🔄 SettingsProvider mounted');
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // console.log('📥 Fetching settings from API...');
      const response = await settingsAPI.getSettings();
      // console.log('📥 API Response:', response);
      
      if (response.data) {
        // ✅ Extract the actual settings data
        const settingsData = response.data.data || response.data;
        // console.log('✅ Settings received:', settingsData);
        setSettings(settingsData);
      } else {
        // console.log('⚠️ No data in response');
      }
    } catch (error) {
      // console.error('❌ Error fetching settings:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
      // console.log('🏁 Settings loading complete');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      // console.log('📤 Updating settings:', newSettings);
      const response = await settingsAPI.updateSettings(newSettings);
      // console.log('📤 Update response:', response.data);
      
      if (response.data) {
        const settingsData = response.data.data || response.data;
        setSettings(settingsData);
      }
      toast.success('Settings saved successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      // console.error('❌ Error updating settings:', error);
      toast.error(error.response?.data?.message || 'Error saving settings');
      return { success: false, error };
    }
  };

  const value = {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };

  // console.log('📦 SettingsProvider value:', value);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;