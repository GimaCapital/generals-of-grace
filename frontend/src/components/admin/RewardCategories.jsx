// frontend/src/components/admin/RewardCategories.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus, Edit3, Trash2, Loader, X, Eye, EyeOff, FolderOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { rewardCategoriesAPI } from '../../services/api';

const CATEGORY_PRESETS = [
  { label: 'Spiritual Honor', description: 'Recognition and honor for your faithfulness', icon: '🏅' },
  { label: 'Learning', description: 'Bible school, books, and mentorship', icon: '📚' },
  { label: 'Leadership', description: 'Roles, retreats, and ministry opportunities', icon: '🎖️' },
  { label: 'Practical Blessings', description: 'Thoughtful gifts and gestures of appreciation', icon: '🎁' },
];

const EMOJI_SUGGESTIONS = ['🎁', '🏅', '📚', '🎖️', '🙏', '👑', '🎓', '💎', '🌟', '✨', '📖', '🕊️'];

const emptyForm = {
  label: '',
  description: '',
  icon: '🎁',
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

function RewardCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const didLoad = useRef(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await rewardCategoriesAPI.adminGetAll();
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load categories');
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

  // ✅ Set of existing labels (lowercased) for instant duplicate check
  const existingLabels = useMemo(
    () =>
      new Set(
        categories
          .filter((c) => c.docId !== editing?.docId)
          .map((c) => c.label.toLowerCase().trim())
      ),
    [categories, editing]
  );

  // ✅ Live duplicate check for current form
  const isDuplicate = useMemo(() => {
    if (!form.label.trim()) return false;
    return existingLabels.has(form.label.toLowerCase().trim());
  }, [form.label, existingLabels]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowPresets(true);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      label: cat.label,
      description: cat.description || '',
      icon: cat.icon || '🎁',
      order: cat.order || 99,
      active: cat.active !== false,
    });
    setShowPresets(false);
    setModalOpen(true);
  };

  const applyPreset = (preset) => {
    const presetIndex = CATEGORY_PRESETS.findIndex((p) => p.label === preset.label);

    // ✅ Warn if this preset would create a duplicate
    if (existingLabels.has(preset.label.toLowerCase().trim())) {
      toast.error(`"${preset.label}" already exists`);
      return;
    }

    setForm({
      ...form,
      label: preset.label,
      description: preset.description,
      icon: preset.icon,
      order: presetIndex + 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return toast.error('Label is required');

    // ✅ Client-side duplicate check
    if (isDuplicate) {
      return toast.error(
        `A category named "${form.label}" already exists`
      );
    }

    setSaving(true);
    try {
      if (editing) {
        await rewardCategoriesAPI.update(editing.docId, form);
        toast.success('Category updated');
      } else {
        await rewardCategoriesAPI.create(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      console.error(error);
      // ✅ Handle backend 409 as well
      if (error.response?.status === 409) {
        toast.error(error.response.data.message || 'Duplicate entry');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.label}"? Rewards in this category will show under "Other".`)) return;
    try {
      await rewardCategoriesAPI.delete(cat.docId);
      toast.success('Category deleted');
      await load();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (cat) => {
    try {
      await rewardCategoriesAPI.update(cat.docId, { active: !cat.active });
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
            <FolderOpen className="w-6 h-6" />
            Reward Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize rewards into categories. Each becomes a tab on the public page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No categories yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Recommended: Spiritual Honor, Learning, Leadership, Practical Blessings.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            Create First Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.docId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{cat.label}</div>
                    {cat.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{cat.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{cat.key}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cat.order}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(cat)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                        cat.active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.active !== false ? (
                        <><Eye className="w-3 h-3" /> Active</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Hidden</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(cat)}
                      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Edit Category' : 'New Category'}
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
                    Recommended Categories
                  </p>
                  <p className="text-xs text-amber-800 mb-3">
                    Click a preset to fill the form. Already-created ones are greyed out.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_PRESETS.map((p) => {
                      const isUsed = existingLabels.has(p.label.toLowerCase().trim());
                      return (
                        <button
                          key={p.label}
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
                          {p.label}
                          {isUsed && <span className="text-[10px]">(exists)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Field
                label="Label"
                required
                helper="The tab name users will see."
              >
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Spiritual Honor"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:outline-none ${
                    isDuplicate
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-gray-900'
                  }`}
                  required
                />
                {isDuplicate && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ A category with this name already exists
                  </p>
                )}
                {!isDuplicate && (
                  <p className="text-xs text-gray-400 mt-1">
                    The internal key is auto-generated from this label.
                  </p>
                )}
              </Field>

              <Field
                label="Description"
                helper="Optional. A short line shown under the tab on the public page."
              >
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="e.g. Recognition and honor for your faithfulness"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Icon (emoji)" helper="Shown next to the tab.">
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🎁"
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
                  {editing ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RewardCategories;