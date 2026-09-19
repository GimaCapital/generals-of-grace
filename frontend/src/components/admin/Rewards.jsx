// frontend/src/components/admin/Rewards.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus, Edit3, Trash2, Loader, X, Eye, EyeOff, Gift, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { rewardsAPI, rewardCategoriesAPI } from '../../services/api';

const REWARD_PRESETS = [
  { title: 'Certificate of First Soul', description: 'A printed certificate honoring your first soul won', soulsRequired: 1, icon: '🌱', order: 1 },
  { title: 'Name on Wall of Honor', description: 'Your name displayed on the church Soul Winner Wall', soulsRequired: 5, icon: '🏅', order: 2 },
  { title: 'Personal Prayer Dedication', description: 'Your name lifted in prayer during Sunday service', soulsRequired: 10, icon: '🙏', order: 3 },
  { title: 'Sunday Service Recognition', description: 'Public recognition before the congregation', soulsRequired: 25, icon: '🎖️', order: 4 },
  { title: 'Featured Testimony', description: 'Your testimony published in the church bulletin', soulsRequired: 50, icon: '📖', order: 5 },
  { title: 'Legacy Honor', description: 'Lifetime honor with portrait on the church wall', soulsRequired: 100, icon: '👑', order: 6 },
  { title: 'Free Bible School Registration', description: 'Full access to church Bible school', soulsRequired: 5, icon: '📚', order: 1 },
  { title: "Pastor's Book Bundle", description: 'A curated collection of soul-winning books', soulsRequired: 10, icon: '📕', order: 2 },
  { title: 'Mentorship Session', description: 'A personal session with the Pastor', soulsRequired: 50, icon: '🤝', order: 3 },
  { title: 'Leadership Prayer Breakfast', description: 'Invited to the monthly leaders gathering', soulsRequired: 10, icon: '☕', order: 1 },
  { title: 'Mission Trip Invitation', description: 'Invited to participate in a mission outreach', soulsRequired: 50, icon: '🌍', order: 2 },
  { title: 'Church Journal & Pen Set', description: 'Beautifully branded church stationery set', soulsRequired: 5, icon: '📓', order: 1 },
  { title: 'Signed Book by Pastor', description: "A signed copy of one of the Pastor's books", soulsRequired: 10, icon: '✍️', order: 2 },
  { title: 'Christian Bookstore Gift Card', description: 'A small gift card to a Christian bookstore', soulsRequired: 25, icon: '🎁', order: 3 },
];

const EMOJI_SUGGESTIONS = ['🏅', '🎁', '📚', '🎖️', '🙏', '👑', '🎓', '💎', '🌟', '📖', '🌱', '❤️', '🔥', '✨'];

const emptyForm = {
  title: '',
  description: '',
  category: '',
  soulsRequired: 1,
  icon: '🏅',
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

function Rewards() {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPresets, setShowPresets] = useState(false);
  const didLoad = useRef(false);

  const load = async () => {
    setLoading(true);
    try {
      const [rewardsRes, catsRes] = await Promise.all([
        rewardsAPI.adminGetAll(),
        rewardCategoriesAPI.adminGetAll(),
      ]);
      setRewards(rewardsRes.data?.data || []);
      setCategories(catsRes.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load rewards');
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

  // ✅ Map of category → set of existing titles (lowercased)
  const existingTitles = useMemo(() => {
    const map = {};
    rewards.forEach((r) => {
      if (editing && r.docId === editing.docId) return;
      if (!map[r.category]) map[r.category] = new Set();
      map[r.category].add(r.title.toLowerCase().trim());
    });
    return map;
  }, [rewards, editing]);

  // ✅ Live duplicate check for current form
  const isDuplicate = useMemo(() => {
    if (!form.title.trim() || !form.category) return false;
    const set = existingTitles[form.category];
    return set ? set.has(form.title.toLowerCase().trim()) : false;
  }, [form.title, form.category, existingTitles]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.key || '' });
    setShowPresets(true);
    setModalOpen(true);
  };

  const openEdit = (reward) => {
    setEditing(reward);
    setForm({
      title: reward.title,
      description: reward.description || '',
      category: reward.category,
      soulsRequired: reward.soulsRequired || 1,
      icon: reward.icon || '🏅',
      order: reward.order || 99,
      active: reward.active !== false,
    });
    setShowPresets(false);
    setModalOpen(true);
  };

  // ✅ Determine which category a preset belongs to based on title
  const detectCategoryForPreset = (presetTitle) => {
    const spiritualTitles = [
      'Certificate of First Soul',
      'Name on Wall of Honor',
      'Personal Prayer Dedication',
      'Sunday Service Recognition',
      'Featured Testimony',
      'Legacy Honor',
    ];
    const learningTitles = [
      'Free Bible School Registration',
      "Pastor's Book Bundle",
      'Mentorship Session',
    ];
    const leadershipTitles = [
      'Leadership Prayer Breakfast',
      'Mission Trip Invitation',
    ];
    if (spiritualTitles.includes(presetTitle)) return 'spiritual-honor';
    if (learningTitles.includes(presetTitle)) return 'learning';
    if (leadershipTitles.includes(presetTitle)) return 'leadership';
    return 'practical-blessings';
  };

  const applyPreset = (preset) => {
    const targetCategory = detectCategoryForPreset(preset.title);

    // ✅ Warn if duplicate
    const set = existingTitles[targetCategory];
    if (set && set.has(preset.title.toLowerCase().trim())) {
      toast.error(`"${preset.title}" already exists in this category`);
      return;
    }

    // Warn if the target category doesn't exist yet
    const hasCat = categories.some((c) => c.key === targetCategory);
    if (!hasCat) {
      toast.error(`Create the category first before adding "${preset.title}"`);
      return;
    }

    setForm({
      ...form,
      title: preset.title,
      description: preset.description,
      soulsRequired: preset.soulsRequired,
      icon: preset.icon,
      order: preset.order || 99,
      category: targetCategory,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.category) return toast.error('Category is required');

    // ✅ Client-side duplicate check
    if (isDuplicate) {
      return toast.error(
        `A reward named "${form.title}" already exists in this category`
      );
    }

    setSaving(true);
    try {
      if (editing) {
        await rewardsAPI.update(editing.docId, form);
        toast.success('Reward updated');
      } else {
        await rewardsAPI.create(form);
        toast.success('Reward created');
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

  const handleDelete = async (reward) => {
    if (!window.confirm(`Delete "${reward.title}"?`)) return;
    try {
      await rewardsAPI.delete(reward.docId);
      toast.success('Reward deleted');
      await load();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (reward) => {
    try {
      await rewardsAPI.update(reward.docId, { active: !reward.active });
      await load();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.key] = c));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    let list = rewards;
    if (filterCategory !== 'all') {
      list = list.filter((r) => r.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q));
    }
    return list;
  }, [rewards, filterCategory, search]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Rewards
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Soul Winner's Honor — what members earn for their faithfulness.
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={categories.length === 0}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          New Reward
        </button>
      </div>

      {categories.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
          <strong>Step 1:</strong> Create at least one <strong>Reward Category</strong> first.
        </div>
      )}

      {!loading && rewards.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search rewards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.docId} value={c.key}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <Gift className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">
            {rewards.length === 0 ? 'No rewards yet' : 'No rewards match your filters'}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Rewards appear on the public page as recognition for members.
          </p>
          {rewards.length === 0 && categories.length > 0 && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
            >
              <Plus className="w-4 h-4" />
              Create First Reward
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Souls</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reward) => (
                <tr key={reward.docId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{reward.icon}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{reward.title}</div>
                    {reward.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{reward.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {categoryMap[reward.category]?.icon} {categoryMap[reward.category]?.label || reward.category}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {reward.soulsRequired}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(reward)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                        reward.active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {reward.active !== false ? (
                        <><Eye className="w-3 h-3" /> Active</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Hidden</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(reward)}
                      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reward)}
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
                {editing ? 'Edit Reward' : 'New Reward'}
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
                    Suggested Rewards
                  </p>
                  <p className="text-xs text-amber-800 mb-3">
                    Click a suggestion to fill the form. Duplicates are greyed out.
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto">
                    {REWARD_PRESETS.map((p) => {
                      const targetCat = detectCategoryForPreset(p.title);
                      const set = existingTitles[targetCat];
                      const isUsed = set && set.has(p.title.toLowerCase().trim());
                      const catMissing = !categories.some((c) => c.key === targetCat);
                      const disabled = isUsed || catMissing;

                      return (
                        <button
                          key={p.title}
                          type="button"
                          onClick={() => applyPreset(p)}
                          disabled={disabled}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                            disabled
                              ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white border border-amber-300 hover:bg-amber-100 text-amber-900'
                          }`}
                          title={catMissing ? 'Category not created yet' : isUsed ? 'Already exists' : ''}
                        >
                          <span className="text-base">{p.icon}</span>
                          {p.title}
                          <span className="text-amber-500">·</span>
                          <span className="text-amber-600">{p.soulsRequired} souls</span>
                          {isUsed && <span className="text-[10px]">(exists)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Field label="Title" required helper="What the member receives.">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Certificate of First Soul"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:outline-none ${
                    isDuplicate
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-gray-900'
                  }`}
                  required
                />
                {isDuplicate && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ A reward with this title already exists in this category
                  </p>
                )}
              </Field>

              <Field label="Description" helper="Short explanation shown to users.">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="e.g. A printed certificate honoring your first soul won"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" required helper="Which tab it appears under.">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.docId} value={c.key}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Souls Required" required helper="Souls needed to earn this.">
                  <input
                    type="number"
                    min="1"
                    value={form.soulsRequired}
                    onChange={(e) => setForm({ ...form, soulsRequired: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Icon (emoji)" helper="Shown with the reward.">
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🏅"
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
                  {editing ? 'Save Changes' : 'Create Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rewards;