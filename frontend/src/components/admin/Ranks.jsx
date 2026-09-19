// frontend/src/components/admin/Ranks.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus, Edit3, Trash2, Loader, X, Eye, EyeOff, Trophy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ranksAPI } from '../../services/api';

const RANK_PRESETS = [
  { name: 'Disciple', description: 'The journey begins — walking with Christ', pointsRequired: 0, icon: '✝️', color: '#6B7280' },
  { name: 'Evangelist', description: 'Consistent in reaching the lost for Christ', pointsRequired: 100, icon: '❤️', color: '#3B82F6' },
  { name: 'Harvester', description: 'Multiplied impact — souls are being gathered', pointsRequired: 500, icon: '🎯', color: '#10B981' },
  { name: 'Kingdom Builder', description: "Building God's kingdom one soul at a time", pointsRequired: 1000, icon: '⛪', color: '#F59E0B' },
  { name: 'General of Grace', description: 'A leader among leaders in soul winning', pointsRequired: 5000, icon: '👑', color: '#C9A84C' },
  { name: 'Great Commission', description: 'Fulfilling the mandate to reach all nations', pointsRequired: 10000, icon: '🚀', color: '#8B5CF6' },
  { name: 'Legacy Builder', description: 'Leaving a lasting legacy for the Kingdom', pointsRequired: 25000, icon: '🔥', color: '#EF4444' },
];

const EMOJI_SUGGESTIONS = ['⭐', '✝️', '❤️', '🎯', '⛪', '👑', '🚀', '🔥', '🏆', '💎', '🌟', '💫'];

const emptyForm = {
  name: '',
  description: '',
  pointsRequired: 0,
  icon: '⭐',
  color: '#6B7280',
  order: 99,
  active: true,
};

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

function Ranks() {
  const [loading, setLoading] = useState(true);
  const [ranks, setRanks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const didLoad = useRef(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await ranksAPI.adminGetAll();
      setRanks(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load ranks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Set of existing rank names (lowercased) for instant duplicate check
  const existingNames = useMemo(
    () =>
      new Set(
        ranks
          .filter((r) => r.docId !== editing?.docId)
          .map((r) => r.name.toLowerCase().trim())
      ),
    [ranks, editing]
  );

  const isDuplicate = useMemo(() => {
    if (!form.name.trim()) return false;
    return existingNames.has(form.name.toLowerCase().trim());
  }, [form.name, existingNames]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowPresets(true);
    setModalOpen(true);
  };

  const openEdit = (rank) => {
    setEditing(rank);
    setForm({
      name: rank.name,
      description: rank.description || '',
      pointsRequired: rank.pointsRequired || 0,
      icon: rank.icon || '⭐',
      color: rank.color || '#6B7280',
      order: rank.order || 99,
      active: rank.active !== false,
    });
    setShowPresets(false);
    setModalOpen(true);
  };

  const applyPreset = (preset) => {
    if (existingNames.has(preset.name.toLowerCase().trim())) {
      toast.error(`"${preset.name}" already exists`);
      return;
    }

    const presetIndex = RANK_PRESETS.findIndex((p) => p.name === preset.name);
    setForm({
      ...form,
      name: preset.name,
      description: preset.description,
      pointsRequired: preset.pointsRequired,
      icon: preset.icon,
      color: preset.color,
      order: presetIndex + 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');

    if (isDuplicate) {
      return toast.error(`A rank named "${form.name}" already exists`);
    }

    setSaving(true);
    try {
      if (editing) {
        await ranksAPI.update(editing.docId, form);
        toast.success('Rank updated');
      } else {
        await ranksAPI.create(form);
        toast.success('Rank created');
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        toast.error(error.response.data.message || 'Duplicate entry');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rank) => {
    if (!window.confirm(`Delete "${rank.name}"?`)) return;
    try {
      await ranksAPI.delete(rank.docId);
      toast.success('Rank deleted');
      await load();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (rank) => {
    try {
      await ranksAPI.update(rank.docId, { active: !rank.active });
      await load();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Ranks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Soul-winning progression tiers. 1 soul = 100 points.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Rank
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : ranks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No ranks yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Start with "Disciple" at 0 points.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            Create First Rank
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank) => (
                <tr key={rank.docId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{rank.icon}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{rank.name}</div>
                    {rank.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{rank.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {rank.pointsRequired}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(rank)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                        rank.active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {rank.active !== false ? (
                        <><Eye className="w-3 h-3" /> Active</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Hidden</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(rank)}
                      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rank)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Edit Rank' : 'New Rank'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {!editing && showPresets && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-amber-900 uppercase tracking-wide mb-2">
                    Quick Start — Recommended Tiers
                  </p>
                  <p className="text-xs text-amber-800 mb-3">
                    Click a preset to auto-fill the entire form. Existing ones are greyed out.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {RANK_PRESETS.map((p) => {
                      const isUsed = existingNames.has(p.name.toLowerCase().trim());
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => applyPreset(p)}
                          disabled={isUsed}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                            isUsed
                              ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white border border-amber-300 hover:bg-amber-100 text-amber-900'
                          }`}
                        >
                          <span className="text-base">{p.icon}</span>
                          {p.name}
                          <span className="text-amber-500">·</span>
                          <span className="text-amber-600">{p.pointsRequired} pts</span>
                          {isUsed && <span className="text-[10px]">(exists)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Field label="Name" required helper="The rank title users see.">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Evangelist"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:outline-none ${
                    isDuplicate
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-gray-900'
                  }`}
                  required
                />
                {isDuplicate && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ A rank with this name already exists
                  </p>
                )}
              </Field>

              <Field label="Description" helper="A short tagline shown on the public page.">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="e.g. Consistent in reaching the lost"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Points Required" required helper="1 soul = 100 points.">
                  <input
                    type="number"
                    min="0"
                    value={form.pointsRequired}
                    onChange={(e) => setForm({ ...form, pointsRequired: e.target.value })}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    required
                  />
                </Field>
                <Field label="Display Order" helper="Lower = first.">
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    placeholder="e.g. 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Icon (emoji)" helper="Shown next to the rank.">
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="⭐"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    maxLength={2}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {EMOJI_SUGGESTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setForm({ ...form, icon: e })}
                        className={`text-lg p-1 rounded hover:bg-gray-100 ${
                          form.icon === e ? 'bg-gray-200' : ''
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Color" helper="Used for the rank badge.">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                </Field>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Show on public page</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || isDuplicate}
                  className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {saving && <Loader className="w-4 h-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Create Rank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ranks;