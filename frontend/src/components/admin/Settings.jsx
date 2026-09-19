// src/components/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, Mail, Bell, Shield, Palette, CreditCard, CheckCircle, Globe, TrendingUp } from 'lucide-react';
import { settingsAPI } from '../../services/api';

function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      const response = await settingsAPI.getSettings();

      if (response.data) {
        const settingsData = response.data.data || response.data;
        setSettings(settingsData);
      }
    } catch (error) {
      toast.error('Error loading settings');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const dataToSend = { ...settings };

      delete dataToSend.id;
      delete dataToSend.createdAt;
      delete dataToSend.updatedAt;
      delete dataToSend.success;
      delete dataToSend.message;

      const response = await settingsAPI.updateSettings(dataToSend);

      if (response.data) {
        const responseData = response.data.data || response.data;
        setSettings(responseData);
      }

      setSaved(true);
      toast.success('Settings saved successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setSettings({
      ...settings,
      [name]: newValue,
    });
  };

  const handleNestedChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
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
                placeholder="Enter site name"
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
                placeholder="Enter site email"
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
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                name="theme"
                value={settings.theme || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              >
                <option value="">Select theme</option>
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
              placeholder="Enter church address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
            />
          </div>
        </div>

        {/* Payment Provider */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-church-gold" />
            Payment Provider
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Select your preferred payment gateway for online giving
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                settings.paymentProvider === 'flutterwave'
                  ? 'border-church-gold bg-church-gold/5'
                  : 'border-gray-200 hover:border-church-gold/50'
              }`}
              onClick={() => {
                setSettings({
                  ...settings,
                  paymentProvider: 'flutterwave',
                });
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-church-navy">Flutterwave</h3>
                  <p className="text-sm text-gray-500">Pan-African payment solution</p>
                </div>
                {settings.paymentProvider === 'flutterwave' && (
                  <CheckCircle className="w-5 h-5 text-church-gold" />
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-church-gold" />
                  <span>Card, USSD, Bank Transfer, Mobile Money</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-church-gold" />
                  <span>1.4% transaction fee</span>
                </div>
              </div>
            </div>

            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                settings.paymentProvider === 'paystack'
                  ? 'border-church-gold bg-church-gold/5'
                  : 'border-gray-200 hover:border-church-gold/50'
              }`}
              onClick={() => {
                setSettings({
                  ...settings,
                  paymentProvider: 'paystack',
                });
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-church-navy">Paystack</h3>
                  <p className="text-sm text-gray-500">Simple Nigerian payment gateway</p>
                </div>
                {settings.paymentProvider === 'paystack' && (
                  <CheckCircle className="w-5 h-5 text-church-gold" />
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-church-gold" />
                  <span>Card, USSD, Bank Transfer, QR Code</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-church-gold" />
                  <span>1.5% + ₦100 (capped at ₦2,000)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings.paymentProvider ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-gray-600">
                Current Provider: <span className="font-semibold capitalize">{settings.paymentProvider || 'Not set'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Soul-Winning Points Ratio */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-church-gold" />
            Soul-Winning Points Ratio
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            How many points each soul is worth. Used to compute ranks.
            Change this and all rank thresholds rescale automatically.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                1 soul = points
              </label>
              <input
                type="number"
                name="soulsToPoints"
                min="1"
                value={settings.soulsToPoints || 10}
                onChange={handleChange}
                placeholder="e.g. 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
              />
              <p className="text-xs text-gray-400 mt-1">
                Example: 5 souls at 10 points each = 50 points
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Preview
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>1 soul</span>
                  <span className="font-medium">
                    {(settings.soulsToPoints || 10) * 1} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>5 souls</span>
                  <span className="font-medium">
                    {(settings.soulsToPoints || 10) * 5} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>10 souls</span>
                  <span className="font-medium">
                    {(settings.soulsToPoints || 10) * 10} pts
                  </span>
                </div>
              </div>
            </div>
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