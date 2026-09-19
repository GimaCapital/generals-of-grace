// frontend/src/components/admin/Souls.jsx
import React, { useState, useEffect } from 'react';
import {
  Heart, Loader, Search, X, ChevronDown, ChevronUp, Trash2,
  MapPin, Mail, Phone, Users, TrendingUp, Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { soulsAPI } from '../../services/api';
import { formatDate, toDate } from '../../utils';

// ============================================================
// CONSTANTS
// ============================================================
const STATUS_OPTIONS = [
  { value: 'reached', label: 'Reached' },
  { value: 'prayed', label: 'Prayed With' },
  { value: 'saved', label: 'Saved' },
  { value: 'baptized', label: 'Baptized' },
  { value: 'discipled', label: 'Discipled' },
];

const METHOD_OPTIONS = [
  { value: 'personal', label: 'Personal' },
  { value: 'street', label: 'Street' },
  { value: 'crusade', label: 'Crusade' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' },
];

const STATUS_BADGE = {
  reached: 'bg-gray-100 text-gray-700',
  prayed: 'bg-blue-100 text-blue-800',
  saved: 'bg-green-100 text-green-800',
  baptized: 'bg-emerald-100 text-emerald-800',
  discipled: 'bg-purple-100 text-purple-800',
};

// ============================================================
// SUB-COMPONENTS
// ============================================================
function StatTile({ label, value, sub, icon: Icon, accent = 'navy' }) {
  const accents = {
    navy: 'bg-church-navy text-white',
    gold: 'bg-church-gold text-white',
    green: 'bg-green-600 text-white',
    slate: 'bg-slate-700 text-white',
  };
  return (
    <div className={`rounded-lg p-4 ${accents[accent]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs opacity-75 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className="opacity-70">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center py-16">
      <Loader className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
  );
}

function SoulRow({ soul, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const date = toDate(soul.dateWon || soul.createdAt);
  const statusBadge = STATUS_BADGE[soul.status] || STATUS_BADGE.reached;

  return (
    <>
      <tr
        className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer ${
          expanded ? 'bg-gray-50' : ''
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 text-gray-400 w-8">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </td>
        <td className="px-4 py-3 text-sm whitespace-nowrap">
          {date ? formatDate(date) : '—'}
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="font-medium text-gray-900">{soul.name}</div>
          <div className="text-xs text-gray-500">{soul.location || '—'}</div>
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="text-gray-900">
            {soul.member?.displayName || '—'}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {soul.member?.titheNumber || '—'}
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${statusBadge}`}
          >
            {soul.status || 'reached'}
          </span>
        </td>
        <td className="px-4 py-3 text-sm capitalize text-gray-600">
          {soul.method || '—'}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50 border-b border-gray-200">
          <td colSpan={6}>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Soul&apos;s Name
                </p>
                <p className="text-gray-900 mt-1">{soul.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-gray-900 mt-1 flex items-center gap-1">
                  {soul.email ? (
                    <>
                      <Mail className="w-3 h-3 text-gray-400" />
                      {soul.email}
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-gray-900 mt-1 flex items-center gap-1">
                  {soul.phone ? (
                    <>
                      <Phone className="w-3 h-3 text-gray-400" />
                      {soul.phone}
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Location
                </p>
                <p className="text-gray-900 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {soul.location || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Method
                </p>
                <p className="text-gray-900 mt-1 capitalize">
                  {soul.method || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Status
                </p>
                <p className="text-gray-900 mt-1 capitalize">
                  {soul.status || '—'}
                </p>
              </div>

              {soul.notes && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Notes
                  </p>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                    {soul.notes}
                  </p>
                </div>
              )}

              <div className="md:col-span-2 lg:col-span-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Won by{' '}
                  <span className="font-medium text-gray-700">
                    {soul.member?.displayName || 'Unknown'}
                  </span>
                  {soul.member?.email && ` (${soul.member.email})`}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(soul);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 hover:underline"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ============================================================
// MAIN
// ============================================================
function AdminSouls() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [souls, setSouls] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(0);
  const [limit] = useState(50);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  // ============================================
  // LOAD
  // ============================================
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await soulsAPI.getAdminStats();
      setStats(res.data?.data || null);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadSouls = async () => {
    setLoading(true);
    try {
      const params = { limit, offset: page * limit };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (methodFilter) params.method = methodFilter;
      if (monthFilter) params.month = monthFilter;

      const res = await soulsAPI.getAll(params);
      setSouls(res.data?.data || []);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      console.error('Souls error:', err);
      toast.error('Failed to load souls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadSouls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, methodFilter, monthFilter]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, methodFilter, monthFilter]);

  const handleDelete = async (soul) => {
    if (
      !window.confirm(
        `Delete the soul record for "${soul.name}"? This cannot be undone.`
      )
    )
      return;
    try {
      await soulsAPI.delete(soul.id);
      toast.success('Soul deleted');
      loadSouls();
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setMethodFilter('');
    setMonthFilter('');
  };

  const hasFilters = search || statusFilter || methodFilter || monthFilter;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-church-gold" />
          Souls Won
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Every soul won across the church — filter, follow up, celebrate.
        </p>
      </div>

      {/* STATS */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatTile
              label="Total Souls"
              value={stats.total}
              sub="All time"
              icon={Heart}
              accent="navy"
            />
            <StatTile
              label="This Month"
              value={stats.thisMonth}
              sub={`${stats.thisWeek} this week`}
              icon={TrendingUp}
              accent="gold"
            />
            <StatTile
              label="Soul Winners"
              value={stats.uniqueWinners}
              sub="Unique members"
              icon={Users}
              accent="green"
            />
            <StatTile
              label="Top Winner"
              value={stats.topWinners?.[0]?.count || 0}
              sub={
                stats.topWinners?.[0]?.displayName?.split(' ')[0] || '—'
              }
              icon={Award}
              accent="slate"
            />
          </div>

          {/* BREAKDOWNS */}
          {stats.total > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* By Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  By Status
                </p>
                <div className="space-y-2">
                  {Object.entries(stats.byStatus || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([status, count]) => {
                      const pct = (count / stats.total) * 100;
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700 capitalize">
                              {status}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {count} ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-church-navy"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Top Winners */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Top Soul Winners
                </p>
                {stats.topWinners?.length === 0 ? (
                  <p className="text-sm text-gray-500">No souls recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topWinners.map((w, idx) => (
                      <div
                        key={w.uid}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0
                                ? 'bg-church-gold text-white'
                                : idx === 1
                                ? 'bg-gray-300 text-gray-700'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-gray-900 truncate">
                              {w.displayName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              {w.titheNumber}
                            </p>
                          </div>
                        </div>
                        <span className="text-gray-900 font-medium flex-shrink-0 ml-2">
                          {w.count} souls
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* FILTERS */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name, email, phone, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
          >
            <option value="">All Methods</option>
            {METHOD_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>

        {hasFilters && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span>Filters active.</span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 underline"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : souls.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {hasFilters
                ? 'No souls match your filters'
                : 'No souls recorded yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Soul</th>
                  <th className="px-4 py-3">Won By</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {souls.map((s) => (
                  <SoulRow key={s.id} soul={s} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
            <span className="text-gray-500">
              Showing {page * limit + 1}–
              {Math.min((page + 1) * limit, pagination.total)} of{' '}
              {pagination.total}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-gray-600">
                Page {page + 1} of {pagination.pages}
              </span>
              <button
                disabled={page + 1 >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSouls;