// frontend/src/components/dashboard/tabs/SoulWinningTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Loader, Plus, X, Users, Award, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { soulsAPI, badgesAPI } from '../../../services/api';
import { formatDate, toDate } from '../../../utils';

// ============================================================
// OPTIONS — with descriptions
// ============================================================
const STATUS_OPTIONS = [
  {
    value: 'reached',
    label: 'Reached',
    description: 'You met them and shared the gospel, but they have not yet made a decision for Christ.',
  },
  {
    value: 'prayed',
    label: 'Prayed With',
    description: 'You prayed together for their needs — they are open to hearing more.',
  },
  {
    value: 'saved',
    label: 'Saved',
    description: 'They prayed to receive Jesus Christ as their Lord and Savior.',
  },
  {
    value: 'baptized',
    label: 'Baptized',
    description: 'They have been baptized in water at church.',
  },
  {
    value: 'discipled',
    label: 'Discipled',
    description: 'You are actively teaching and walking with them in their faith.',
  },
];

const METHOD_OPTIONS = [
  {
    value: 'personal',
    label: 'Personal',
    description: 'One-on-one — a friend, family member, or coworker.',
  },
  {
    value: 'street',
    label: 'Street',
    description: 'Street evangelism or tract distribution — market, bus stop, or public place.',
  },
  {
    value: 'crusade',
    label: 'Crusade',
    description: 'A church event, revival service, or organized outreach program.',
  },
  {
    value: 'online',
    label: 'Online',
    description: 'Social media, WhatsApp, phone call, or video call.',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Any other way — hospital visit, prison ministry, school outreach, etc.',
  },
];

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  dateWon: new Date().toISOString().split('T')[0],
  location: '',
  method: 'personal',
  status: 'reached',
  notes: '',
};

// ============================================================
// FIELD WRAPPER
// ============================================================
function Field({ label, required, helper, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  );
}

// ============================================================
// DESCRIPTIVE SELECT — custom dropdown with descriptions
// ============================================================
function DescriptiveSelect({ value, options, onChange, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-left focus:ring-2 focus:ring-gray-900 focus:outline-none"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-72 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                  isSelected ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
function SoulWinningTab() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [souls, setSouls] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, byStatus: {} });
  const [badges, setBadges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!currentUser?.uid) return;
    try {
      const [soulsRes, statsRes, badgeRes] = await Promise.all([
        soulsAPI.getByUser(currentUser.uid).catch(() => ({ data: { data: [] } })),
        soulsAPI.getStats(currentUser.uid).catch(() => ({ data: { data: {} } })),
        badgesAPI.getProgress(currentUser.uid).catch(() => ({ data: { data: [] } })),
      ]);
      setSouls(soulsRes.data?.data || []);
      setStats(statsRes.data?.data || { total: 0, thisMonth: 0, byStatus: {} });
      setBadges(badgeRes.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      await soulsAPI.create(form);
      toast.success('Soul recorded');
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await soulsAPI.delete(id);
      toast.success('Deleted');
      await load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Souls Won</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Lifetime</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">This Month</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.thisMonth || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Current month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Badges Earned</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{earnedBadges.length}</p>
              <p className="text-xs text-gray-500 mt-1">Achievements</p>
            </div>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Soul Won
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Record a Soul</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Log someone you led to Christ or prayed with.
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}
              <Field
                label="Full Name"
                required
                helper="The person's name — how you'd refer to them."
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  required
                />
              </Field>

              {/* DATE */}
              <Field
                label="Date Won"
                helper="When did you reach or lead them to Christ?"
              >
                <input
                  type="date"
                  value={form.dateWon}
                  onChange={(e) => setForm({ ...form, dateWon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </Field>

              {/* PHONE */}
              <Field
                label="Phone Number"
                helper="Optional — helps you follow up later."
              >
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 08012345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </Field>

              {/* EMAIL */}
              <Field
                label="Email"
                helper="Optional — for sending them resources."
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </Field>

              {/* LOCATION */}
              <Field
                label="Location"
                helper="Where did this happen? (e.g. Ikeja, Lagos)"
              >
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Ikeja, Lagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </Field>

              {/* METHOD — custom dropdown */}
              <Field
                label="How Did You Reach Them?"
                helper={
                  METHOD_OPTIONS.find((o) => o.value === form.method)?.description ||
                  'Pick the method that led to their decision.'
                }
              >
                <DescriptiveSelect
                  value={form.method}
                  options={METHOD_OPTIONS}
                  onChange={(val) => setForm({ ...form, method: val })}
                  placeholder="Select method..."
                />
              </Field>

              {/* STATUS — custom dropdown */}
              <Field
                label="Where Are They Now?"
                helper={
                  STATUS_OPTIONS.find((o) => o.value === form.status)?.description ||
                  'Pick where they are in their walk with Christ.'
                }
              >
                <DescriptiveSelect
                  value={form.status}
                  options={STATUS_OPTIONS}
                  onChange={(val) => setForm({ ...form, status: val })}
                  placeholder="Select status..."
                />
              </Field>

              {/* NOTES */}
              <div className="md:col-span-2">
                <Field
                  label="Notes"
                  helper="Anything you want to remember about them or their situation."
                >
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="e.g. Met him at the market. His wife is sick — pray for her."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving && <Loader className="w-4 h-4 animate-spin" />}
                Save Soul
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BADGES */}
      {badges.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Your Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`rounded-lg border p-4 text-center ${
                  b.earned
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-gray-200 bg-gray-50/40'
                }`}
              >
                <div className={`text-3xl mb-2 ${b.earned ? '' : 'opacity-30 grayscale'}`}>
                  {b.emoji}
                </div>
                <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-500 mt-1">{b.description}</p>
                {b.earned ? (
                  <p className="text-xs text-amber-700 font-medium mt-2">
                    ✓ {toDate(b.earnedAt) ? formatDate(toDate(b.earnedAt)) : ''}
                  </p>
                ) : b.target > 0 ? (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900"
                        style={{ width: `${Math.min(100, (b.progress / b.target) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {b.progress} / {b.target}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SOULS LIST */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Souls Won</h3>
        </div>
        {souls.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No souls recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {souls.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {toDate(s.dateWon) ? formatDate(toDate(s.dateWon)) : '—'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{s.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 capitalize">{s.status}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{s.location || '—'}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SoulWinningTab;