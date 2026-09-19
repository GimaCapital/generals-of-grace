// frontend/src/components/dashboard/tabs/ProfileTab.jsx
import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

function ProfileTab() {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    phoneNumber: '',
    address: '',
  });

  useEffect(() => {
    setForm({
      displayName: userProfile?.displayName || '',
      phoneNumber: userProfile?.phoneNumber || '',
      address: userProfile?.address || '',
    });
  }, [userProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      displayName: userProfile?.displayName || '',
      phoneNumber: userProfile?.phoneNumber || '',
      address: userProfile?.address || '',
    });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Profile</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <Field label="Full Name" editing={editing} value={form.displayName}
          onChange={(v) => setForm({ ...form, displayName: v })}
          display={userProfile?.displayName || '—'} />
        <Field label="Email" display={currentUser?.email || '—'} />
        <Field label="Phone" editing={editing} value={form.phoneNumber}
          onChange={(v) => setForm({ ...form, phoneNumber: v })}
          placeholder="08012345678"
          display={userProfile?.phoneNumber || '—'} />
        <Field label="Tithe Number" display={userProfile?.titheNumber || '—'} mono />
        <div className="md:col-span-2">
          <Field label="Address" editing={editing} value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            display={userProfile?.address || '—'} multiline />
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, editing, value, onChange, display, placeholder, mono, multiline }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
    {editing ? (
      multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none" />
      )
    ) : (
      <p className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}>{display}</p>
    )}
  </div>
);

export default ProfileTab;