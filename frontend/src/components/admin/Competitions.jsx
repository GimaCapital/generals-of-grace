// frontend/src/components/admin/Competitions.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Plus, X, Edit3, Trash2, Loader, ChevronDown, ChevronUp,
  Users, Calendar, Target,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { competitionsAPI } from '../../services/api';
import { formatDate, toDate } from '../../utils';

// ============================================================
// CONSTANTS
// ============================================================
const TEAM_TYPES = [
  { value: 'zone', label: 'Zone' },
  { value: 'department', label: 'Department' },
  { value: 'age-group', label: 'Age Group' },
];

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const STATUS_BADGE = {
  active: 'bg-green-100 text-green-800',
  upcoming: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-700',
};

const emptyForm = () => ({
  name: '',
  description: '',
  theme: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  goal: 100,
  teamType: 'zone',
  teamsText: '',
  status: 'upcoming',
});

// ============================================================
// SUB-COMPONENTS
// ============================================================
const LoadingState = () => (
  <div className="flex justify-center py-16">
    <Loader className="w-6 h-6 text-gray-400 animate-spin" />
  </div>
);

function ProgressBar({ current, goal, label }) {
  const pct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {current} / {goal} souls
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CompetitionCard({ comp, onEdit, onDelete, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const loadDetails = async () => {
    if (details) return;
    setLoadingDetails(true);
    try {
      const res = await competitionsAPI.getById(comp.id);
      setDetails(res.data?.data || null);
    } catch {
      toast.error('Failed to load competition');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) loadDetails();
  };

  const startDate = toDate(comp.startDate);
  const endDate = toDate(comp.endDate);
  const leaderboard = details?.leaderboard || [];
  const churchTotal = details?.churchTotal || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {comp.name}
              </h3>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  STATUS_BADGE[comp.status] || STATUS_BADGE.upcoming
                }`}
              >
                {comp.status}
              </span>
            </div>
            {comp.description && (
              <p className="text-sm text-gray-500 mt-1">{comp.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {startDate ? formatDate(startDate) : '—'} → {endDate ? formatDate(endDate) : '—'}
              </span>
              <span className="inline-flex items-center gap-1 capitalize">
                <Users className="w-3.5 h-3.5" />
                {comp.teamType}
              </span>
              <span className="inline-flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Goal: {comp.goal}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(comp)}
              className="p-2 text-gray-500 hover:text-gray-900 rounded"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(comp)}
              className="p-2 text-gray-500 hover:text-red-600 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleExpand}
              className="p-2 text-gray-500 hover:text-gray-900 rounded"
              title={expanded ? 'Collapse' : 'View leaderboard'}
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <ProgressBar
          current={churchTotal}
          goal={comp.goal}
          label="Church-wide Progress"
        />
      </div>

      {expanded && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50/50">
          {loadingDetails ? (
            <div className="flex justify-center py-6">
              <Loader className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No teams have participants yet
            </p>
          ) : (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Team Leaderboard
              </p>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-2.5 w-16">Rank</th>
                      <th className="px-4 py-2.5">Team</th>
                      <th className="px-4 py-2.5 text-right">Members</th>
                      <th className="px-4 py-2.5 text-right">Souls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((t) => (
                      <tr
                        key={t.teamId}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-2.5 text-sm font-mono text-gray-500">
                          #{t.rank}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-900">
                          {t.teamName}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-600 text-right tabular-nums">
                          {t.memberCount}
                        </td>
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-900 text-right tabular-nums">
                          {t.soulsWon}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MODAL — Create / Edit Competition
// ============================================================
function CompetitionModal({ open, onClose, editing, onSaved }) {
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        name: editing.name || '',
        description: editing.description || '',
        theme: editing.theme || '',
        startDate: (editing.startDate || '').split('T')[0] || '',
        endDate: (editing.endDate || '').split('T')[0] || '',
        goal: editing.goal || 100,
        teamType: editing.teamType || 'zone',
        teamsText: '', // teams loaded separately (not from the edit form)
        status: editing.status || 'upcoming',
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, editing]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.startDate || !form.endDate) return toast.error('Dates are required');

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        theme: form.theme.trim(),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        goal: Number(form.goal) || 0,
        teamType: form.teamType,
        status: form.status,
      };

      if (editing) {
        await competitionsAPI.update(editing.id, payload);
        toast.success('Competition updated');
      } else {
        const res = await competitionsAPI.create(payload);
        const created = res.data?.data;

        // If teams were entered, join the admin to the first team as a placeholder
        // (teams will fill in as users pick — this just seeds the team list)
        if (form.teamsText.trim() && created?.id) {
          const teams = form.teamsText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

          toast.success(
            `Competition created with ${teams.length} teams. Users will pick their team when they open it.`
          );
        } else {
          toast.success('Competition created');
        }
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            {editing ? 'Edit Competition' : 'New Competition'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="40 Days of Harvest"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              placeholder="Reach 500 souls as a church"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Goal (souls)
              </label>
              <input
                type="number"
                min="1"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Team Type
              </label>
              <select
                value={form.teamType}
                onChange={(e) =>
                  setForm({ ...form, teamType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              >
                {TEAM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {!editing && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Teams (comma-separated, optional)
              </label>
              <input
                type="text"
                value={form.teamsText}
                onChange={(e) =>
                  setForm({ ...form, teamsText: e.target.value })
                }
                placeholder="Zone 1, Zone 2, Zone 3, Zone 4, Zone 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Users will pick their team when they open the competition.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
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
              {editing ? 'Save Changes' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
function AdminCompetitions() {
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await competitionsAPI.getAll();
      setCompetitions(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return competitions;
    return competitions.filter((c) => c.status === filter);
  }, [competitions, filter]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (comp) => {
    setEditing(comp);
    setModalOpen(true);
  };

  const handleDelete = async (comp) => {
    if (!window.confirm(`Delete "${comp.name}"? This cannot be undone.`)) return;
    try {
      await competitionsAPI.delete(comp.id);
      toast.success('Competition deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Competitions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Soul-winning campaigns and team standings
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Competition
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              filter === f.key
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} of {competitions.length}
        </span>
      </div>

      {/* LIST */}
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {filter === 'all'
              ? 'No competitions yet'
              : `No ${filter} competitions`}
          </p>
          {filter === 'all' && (
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
            >
              <Plus className="w-4 h-4" />
              Create First Competition
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <CompetitionCard
              key={c.id}
              comp={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={load}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      <CompetitionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={load}
      />
    </div>
  );
}

export default AdminCompetitions;