// frontend/src/components/admin/Badges.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus, Edit3, Trash2, Loader, X, Eye, EyeOff, Award, Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { badgesAPI } from '../../services/api';

// ============================================================
// PRESETS
// ============================================================
const BADGE_PRESETS = [
  { id: 'first-fruit', name: 'First Fruit', description: 'Won your first soul', emoji: '🌱', category: 'milestone', requirement: { soulsWon: 1 }, order: 1 },
  { id: 'soul-winner', name: 'Soul Winner', description: 'Won 5 souls', emoji: '🌿', category: 'milestone', requirement: { soulsWon: 5 }, order: 2 },
  { id: 'faithful-witness', name: 'Faithful Witness', description: 'Won 10 souls', emoji: '🌾', category: 'milestone', requirement: { soulsWon: 10 }, order: 3 },
  { id: 'fruitful-branch', name: 'Fruitful Branch', description: 'Won 25 souls', emoji: '🌳', category: 'milestone', requirement: { soulsWon: 25 }, order: 4 },
  { id: 'soul-champion', name: 'Soul Champion', description: 'Won 50 souls', emoji: '🏆', category: 'milestone', requirement: { soulsWon: 50 }, order: 5 },
  { id: 'soul-legacy', name: 'Soul Legacy', description: 'Won 100 souls', emoji: '👑', category: 'milestone', requirement: { soulsWon: 100 }, order: 6 },
];

const EMOJI_SUGGESTIONS = ['🌱', '🌿', '🌾', '🌳', '🏆', '👑', '👨‍👩‍👧', '🎓', '📖', '🔄', '⭐', '🏅', '💎', '🔥', '✨'];

const emptyForm = {
  id: '',
  name: '',
  description: '',
  emoji: '🏅',
  category: 'milestone',
  soulsWon: 1,
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

function Badges() {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showOrderLockedMessage, setShowOrderLockedMessage] = useState(false);
  const didLoad = useRef(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await badgesAPI.adminGetAll();
      setBadges(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load badges');
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

  const existingNames = useMemo(
    () =>
      new Set(
        badges
          .filter((b) => b.docId !== editing?.docId)
          .map((b) => b.name.toLowerCase().trim())
      ),
    [badges, editing]
  );

  const isDuplicate = useMemo(() => {
    if (!form.name.trim()) return false;
    return existingNames.has(form.name.toLowerCase().trim());
  }, [form.name, existingNames]);

  const getNextOrder = () => {
    if (badges.length === 0) return 1;
    const maxOrder = Math.max(...badges.map((b) => b.order || 0));
    return maxOrder + 1;
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: getNextOrder() });
    setShowPresets(true);
    setShowOrderLockedMessage(false);
    setModalOpen(true);
  };

  const openEdit = (badge) => {
    setEditing(badge);
    setForm({
      id: badge.id || '',
      name: badge.name,
      description: badge.description || '',
      emoji: badge.emoji || '🏅',
      category: badge.category || 'milestone',
      soulsWon: badge.requirement?.soulsWon || 0,
      order: badge.order || 99,
      active: badge.active !== false,
    });
    setShowPresets(false);
    setShowOrderLockedMessage(false);
    setModalOpen(true);
  };

  const applyPreset = (preset) => {
    if (existingNames.has(preset.name.toLowerCase().trim())) {
      toast.error(`"${preset.name}" already exists`);
      return;
    }
    setForm({
      ...form,
      id: preset.id,
      name: preset.name,
      description: preset.description,
      emoji: preset.emoji,
      category: preset.category,
      soulsWon: preset.requirement.soulsWon || 0,
      order: preset.order,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');

    if (isDuplicate) {
      return toast.error(`A badge named "${form.name}" already exists`);
    }

    setSaving(true);
    try {
      const requirement =
        form.category === 'milestone'
          ? { soulsWon: Number(form.soulsWon) || 0 }
          : { specific: form.id || form.name.toLowerCase().replace(/\s+/g, '-') };

      const payload = {
        id: form.id || form.name.toLowerCase().replace(/\s+/g, '-'),
        name: form.name.trim(),
        description: form.description || '',
        emoji: form.emoji || '🏅',
        category: form.category,
        requirement,
        order: editing ? undefined : getNextOrder(),
        active: form.active !== false,
      };

      Object.keys(payload).forEach(
        (k) => payload[k] === undefined && delete payload[k]
      );

      if (editing) {
        await badgesAPI.update(editing.docId, payload);
        toast.success('Badge updated');
      } else {
        await badgesAPI.create(payload);
        toast.success('Badge created');
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

  const handleDelete = async (badge) => {
    if (!window.confirm(`Delete "${badge.name}"? This cannot be undone.`)) return;
    try {
      await badgesAPI.delete(badge.docId);
      toast.success('Badge deleted');
      await load();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (badge) => {
    try {
      await badgesAPI.update(badge.docId, { active: !badge.active });
      await load();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleOrderFieldClick = () => {
    setShowOrderLockedMessage(true);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Badges
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Soul-winning achievements. Each unlocks at a soul count or manually.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Badge
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : badges.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No badges yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Start with "First Fruit" at 1 soul.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            Create First Badge
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Souls</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {badges.map((badge) => (
                <tr key={badge.docId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{badge.emoji}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                    {badge.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{badge.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                    {badge.category || 'milestone'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {badge.requirement?.soulsWon !== undefined
                      ? badge.requirement.soulsWon
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(badge)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                        badge.active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {badge.active !== false ? (
                        <><Eye className="w-3 h-3" /> Active</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Hidden</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(badge)}
                      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(badge)}
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
                {editing ? 'Edit Badge' : 'New Badge'}
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
                    Recommended Badges
                  </p>
                  <p className="text-xs text-amber-800 mb-3">
                    Click a preset to auto-fill the entire form.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_PRESETS.map((p) => {
                      const isUsed = existingNames.has(p.name.toLowerCase().trim());
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => applyPreset(p)}
                          disabled={isUsed}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                            isUsed
                              ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white border border-amber-300 hover:bg-amber-100 text-amber-900'
                          }`}
                        >
                          <span className="text-base">{p.emoji}</span>
                          {p.name}
                          <span className="text-amber-500">·</span>
                          <span className="text-amber-600">{p.requirement.soulsWon} souls</span>
                          {isUsed && <span className="text-[10px]">(exists)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Field label="Name" required helper="The badge title users see.">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Faithful Witness"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:outline-none ${
                    isDuplicate
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-gray-900'
                  }`}
                  required
                />
                {isDuplicate && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ A badge with this name already exists
                  </p>
                )}
              </Field>

              <Field label="Description" helper="A short line shown to users.">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="e.g. Won 10 souls"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="How is this badge earned?"
                  required
                  helper={
                    form.category === 'milestone'
                      ? '✅ The system awards it automatically when the member reaches the soul count.'
                      : '✅ An admin awards it manually from the Members page.'
                  }
                >
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  >
                    <option value="milestone">
                      🎯 Automatic — unlocks at a soul count
                    </option>
                    <option value="special">
                      🖐️ Manual — an admin awards it
                    </option>
                  </select>
                </Field>

                {form.category === 'milestone' && (
                  <Field
                    label="Souls Required"
                    required
                    helper={`The badge unlocks when the member's total souls reach this number. Example: with 5 souls, "Faithful Witness" (10 souls) shows as 5/10.`}
                  >
                    <input
                      type="number"
                      min="1"
                      value={form.soulsWon}
                      onChange={(e) => setForm({ ...form, soulsWon: e.target.value })}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                      required
                    />
                  </Field>
                )}

                {form.category === 'special' && (
                  <Field
                    label="Internal Key"
                    helper="A short identifier used by the system. Leave as suggested unless you have a reason to change it."
                  >
                    <input
                      type="text"
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      placeholder="e.g. family-builder"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                  </Field>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Icon (emoji)" helper="Shown on the badge card.">
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    placeholder="🏅"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    maxLength={2}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {EMOJI_SUGGESTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setForm({ ...form, emoji: e })}
                        className={`text-lg p-1 rounded hover:bg-gray-100 ${
                          form.emoji === e ? 'bg-gray-200' : ''
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Display Order" helper="Auto-managed. Click to learn why.">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleOrderFieldClick}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-600 bg-gray-50 cursor-help hover:bg-gray-100 transition"
                    >
                      <span className="tabular-nums">{form.order}</span>
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {showOrderLockedMessage && (
                      <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 z-10 shadow-lg">
                        <p className="font-medium mb-1">Order is locked</p>
                        <p className="mb-2">
                          Badges are displayed in the order they were created.
                          This keeps the ladder climbing naturally.
                        </p>
                        <p className="mb-2">
                          If you truly need to reorder, please contact the
                          developer — it's a quick change in the database.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowOrderLockedMessage(false)}
                          className="text-amber-700 hover:text-amber-900 underline"
                        >
                          Got it
                        </button>
                      </div>
                    )}
                  </div>
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
                  {editing ? 'Save Changes' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Badges;