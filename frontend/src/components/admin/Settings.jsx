// src/components/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, RefreshCw, Mail, Bell, Shield, Palette } from 'lucide-react';
import { settingsAPI } from '../../services/api';

function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    enableRegistration: true,
    enableGiving: true,
    enableLiveStream: true,
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);

  // ✅ Fetch settings from backend
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      // console.log('📥 Fetching settings...');
      const response = await settingsAPI.getSettings();
      // console.log('📥 Settings response:', response.data);
      
      if (response.data) {
        // ✅ Override all settings with data from backend
        setSettings({
          siteName: response.data.siteName || '',
          siteEmail: response.data.siteEmail || '',
          sitePhone: response.data.sitePhone || '',
          siteAddress: response.data.siteAddress || '',
          enableRegistration: response.data.enableRegistration !== undefined ? response.data.enableRegistration : true,
          enableGiving: response.data.enableGiving !== undefined ? response.data.enableGiving : true,
          enableLiveStream: response.data.enableLiveStream !== undefined ? response.data.enableLiveStream : true,
          theme: response.data.theme || 'light',
          notifications: {
            email: response.data.notifications?.email !== undefined ? response.data.notifications.email : true,
            sms: response.data.notifications?.sms !== undefined ? response.data.notifications.sms : false,
            push: response.data.notifications?.push !== undefined ? response.data.notifications.push : true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings');
    } finally {
      setFetching(false);
    }
  };

  // ✅ Save settings to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    try {
      // ✅ Send the current settings state
      // console.log('📤 Saving settings:', settings);
      
      const response = await settingsAPI.updateSettings(settings);
      // console.log('📤 Save response:', response.data);
      
      // ✅ Update the form with the saved data
      if (response.data) {
        setSettings({
          siteName: response.data.siteName || settings.siteName,
          siteEmail: response.data.siteEmail || settings.siteEmail,
          sitePhone: response.data.sitePhone || settings.sitePhone,
          siteAddress: response.data.siteAddress || settings.siteAddress,
          enableRegistration: response.data.enableRegistration !== undefined ? response.data.enableRegistration : settings.enableRegistration,
          enableGiving: response.data.enableGiving !== undefined ? response.data.enableGiving : settings.enableGiving,
          enableLiveStream: response.data.enableLiveStream !== undefined ? response.data.enableLiveStream : settings.enableLiveStream,
          theme: response.data.theme || settings.theme,
          notifications: {
            email: response.data.notifications?.email !== undefined ? response.data.notifications.email : settings.notifications.email,
            sms: response.data.notifications?.sms !== undefined ? response.data.notifications.sms : settings.notifications.sms,
            push: response.data.notifications?.push !== undefined ? response.data.notifications.push : settings.notifications.push
          }
        });
      }
      
      setSaved(true);
      toast.success('Settings saved successfully!');
      
      // ✅ Reset saved state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNestedChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-church-navy mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-church-gold" />
            General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Email</label>
              <input
                type="email"
                name="siteEmail"
                value={settings.siteEmail || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="sitePhone"
                value={settings.sitePhone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                name="theme"
                value={settings.theme || 'light'}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="siteAddress"
              value={settings.siteAddress || ''}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-church-gold" />
            Feature Settings
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">User Registration</p>
                <p className="text-sm text-gray-500">Allow new users to register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableRegistration"
                  checked={settings.enableRegistration || false}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-church-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-gold"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Online Giving</p>
                <p className="text-sm text-gray-500">Enable online giving feature</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableGiving"
                  checked={settings.enableGiving || false}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-church-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-gold"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Live Streaming</p>
                <p className="text-sm text-gray-500">Enable live stream feature</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableLiveStream"
                  checked={settings.enableLiveStream || false}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-church-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-church-gold"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-church-gold" />
            Notification Settings
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications?.email || false}
                onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                className="h-4 w-4 text-church-gold focus:ring-church-gold border-gray-300 rounded"
              />
              <label className="text-sm">Email Notifications</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications?.sms || false}
                onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                className="h-4 w-4 text-church-gold focus:ring-church-gold border-gray-300 rounded"
              />
              <label className="text-sm">SMS Notifications</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications?.push || false}
                onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                className="h-4 w-4 text-church-gold focus:ring-church-gold border-gray-300 rounded"
              />
              <label className="text-sm">Push Notifications</label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="ml-3 text-green-600 text-sm flex items-center">
              ✅ Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminSettings;