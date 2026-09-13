// frontend/src/components/admin/Giving.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { givingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Search,
  CreditCard,
  ArrowForward,
  TrendingUp,
  People,
  Receipt as ReceiptIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils';

/**
 * Admin Giving — Ministry & Donor view.
 *
 * Complements /admin/payments:
 *   - Payments: financial ledger (fees, net, provider refs, reconciliation)
 *   - Giving:   ministry lens (by type, top donors, trends)
 *
 * This page is a PURE OVERVIEW:
 *   - No transaction table (that lives in Payments)
 *   - Aggregates only: totals, breakdowns, leaderboards
 *
 * All giving records fetched once, then filtered client-side by period.
 */

const PERIODS = [
  { key: 'all', label: 'All Time' },
  { key: 'year', label: 'This Year' },
  { key: 'month', label: 'This Month' },
  { key: 'week', label: 'This Week' },
];

const TYPE_COLORS = {
  tithe: 'bg-blue-500',
  offering: 'bg-purple-500',
  building: 'bg-amber-500',
  mission: 'bg-emerald-500',
  seed: 'bg-pink-500',
  thanksgiving: 'bg-cyan-500',
  'prophetic-seed': 'bg-indigo-500',
  'pastors-gift': 'bg-rose-500',
  custom: 'bg-gray-500',
};

const safeNumber = (v) => (typeof v === 'number' && !isNaN(v) ? v : 0);

const getRecordDate = (record) => {
  const d = record.paidAt || record.date || record.createdAt;
  if (!d) return null;
  if (typeof d === 'object' && d._seconds) return new Date(d._seconds * 1000);
  if (typeof d === 'object' && d.seconds) return new Date(d.seconds * 1000);
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const isWithinPeriod = (date, period) => {
  if (!date || period === 'all') return true;
  const now = new Date();
  const start = new Date(now);
  if (period === 'week') {
    start.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    start.setMonth(now.getMonth() - 1);
  } else if (period === 'year') {
    start.setFullYear(now.getFullYear() - 1);
  }
  return date >= start;
};

function StatTile({ label, value, sub, icon, accent = 'navy' }) {
  const accents = {
    navy: 'bg-church-navy text-white',
    gold: 'bg-church-gold text-white',
    green: 'bg-green-600 text-white',
    slate: 'bg-slate-700 text-white',
  };
  return (
    <div className={`rounded-xl shadow-md p-5 ${accents[accent]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs opacity-75 mt-1">{sub}</p>}
        </div>
        <div className="opacity-70">{icon}</div>
      </div>
    </div>
  );
}

function AdminGiving() {
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchGivingData();
  }, []);

  const fetchGivingData = async () => {
    try {
      setLoading(true);
      const res = await givingAPI.getHistory({ limit: 1000 });
      const data = res.data?.data || [];
      setAllRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Giving fetch failed:', error);
      toast.error('Error loading giving data');
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FILTERED SET (period + search + type)
  // ============================================================
  const periodFiltered = useMemo(() => {
    return allRecords.filter((r) =>
      isWithinPeriod(getRecordDate(r), period)
    );
  }, [allRecords, period]);

  const searchAndTypeFiltered = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return periodFiltered.filter((r) => {
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (!s) return true;
      const hay = [
        r.titheNumber,
        r.email,
        r.reference,
        r.flutterwaveRef,
        r.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(s);
    });
  }, [periodFiltered, searchTerm, filterType]);

  // ============================================================
  // AGGREGATES — based on search/type-filtered set
  // ============================================================
  const aggregates = useMemo(() => {
    const total = searchAndTypeFiltered.reduce(
      (sum, r) => sum + safeNumber(r.amount),
      0
    );
    const count = searchAndTypeFiltered.length;
    const successful = searchAndTypeFiltered.filter(
      (r) => r.status === 'successful' || r.status === 'success'
    ).length;
    const successRate = count > 0 ? (successful / count) * 100 : 0;

    // Unique donors by titheNumber or email
    const donorSet = new Set();
    searchAndTypeFiltered.forEach((r) => {
      const id = r.titheNumber || r.email;
      if (id) donorSet.add(id);
    });
    const donors = donorSet.size;

    // By type
    const byType = {};
    searchAndTypeFiltered.forEach((r) => {
      const t = r.type || 'custom';
      if (!byType[t]) byType[t] = { amount: 0, count: 0 };
      byType[t].amount += safeNumber(r.amount);
      byType[t].count += 1;
    });

    // Top donors
    const donorMap = {};
    searchAndTypeFiltered.forEach((r) => {
      const id = r.titheNumber || r.email || 'unknown';
      if (!donorMap[id]) {
        donorMap[id] = {
          id,
          name: r.email || 'Unknown',
          total: 0,
          count: 0,
        };
      }
      donorMap[id].total += safeNumber(r.amount);
      donorMap[id].count += 1;
    });
    const topDonors = Object.values(donorMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { total, count, successful, successRate, donors, byType, topDonors };
  }, [searchAndTypeFiltered]);

  // ============================================================
  // TYPE LIST (for dropdown + breakdown)
  // ============================================================
  const availableTypes = useMemo(() => {
    const set = new Set(allRecords.map((r) => r.type).filter(Boolean));
    return Array.from(set).sort();
  }, [allRecords]);

  const typeBreakdown = useMemo(() => {
    return Object.entries(aggregates.byType)
      .map(([type, { amount, count }]) => ({
        type,
        amount,
        count,
        pct: aggregates.total > 0 ? (amount / aggregates.total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [aggregates]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-church-navy flex items-center gap-3">
            <HeartIcon className="text-4xl text-church-gold" />
            Giving
          </h1>
          <p className="text-gray-600 mt-1">
            Ministry giving overview — by type, by donor, by period.
          </p>
        </div>
        <Link
          to="/admin/payments"
          className="inline-flex items-center gap-2 self-start px-4 py-2 text-sm bg-church-navy text-white rounded-lg hover:bg-opacity-90 transition"
        >
          View Financial Ledger
          <ArrowForward className="w-4 h-4" />
        </Link>
      </div>

      {/* PERIOD TABS */}
      <div className="flex items-center gap-1 mb-6 border-b overflow-x-auto">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 whitespace-nowrap transition ${
              period === p.key
                ? 'border-church-gold text-church-navy'
                : 'border-transparent text-gray-500 hover:text-church-navy'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* SEARCH + FILTER (drives aggregates + breakdown + donors) */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tithe number, email, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold focus:outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-church-gold focus:outline-none"
          >
            <option value="all">All Types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STAT TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile
          label="Total Given"
          value={formatCurrency(aggregates.total)}
          sub={`${aggregates.count} transactions`}
          icon={<TrendingUp className="w-6 h-6" />}
          accent="navy"
        />
        <StatTile
          label="Donors"
          value={aggregates.donors}
          sub="Unique givers"
          icon={<People className="w-6 h-6" />}
          accent="gold"
        />
        <StatTile
          label="Successful"
          value={aggregates.successful}
          sub={`${aggregates.count - aggregates.successful} pending / failed`}
          icon={<ReceiptIcon className="w-6 h-6" />}
          accent="green"
        />
        <StatTile
          label="Success Rate"
          value={`${aggregates.successRate.toFixed(1)}%`}
          sub="Completed vs attempted"
          icon={<CreditCard className="w-6 h-6" />}
          accent="slate"
        />
      </div>

      {/* BY TYPE */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-church-navy">
            Giving by Type
          </h2>
          <span className="text-xs text-gray-500">
            {typeBreakdown.length} categories
          </span>
        </div>

        {typeBreakdown.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No giving records match your filters.
          </p>
        ) : (
          <div className="space-y-3">
            {typeBreakdown.map(({ type, amount, count, pct }) => (
              <div key={type}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="capitalize font-medium text-church-navy">
                    {type.replace('-', ' ')}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-church-navy">
                      {formatCurrency(amount)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {pct.toFixed(1)}% · {count}
                    </span>
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      TYPE_COLORS[type] || 'bg-church-gold'
                    } transition-all`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOP DONORS */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-church-navy">
            Top Donors
          </h2>
          <span className="text-xs text-gray-500">
            {PERIODS.find((p) => p.key === period)?.label}
          </span>
        </div>

        {aggregates.topDonors.length === 0 ? (
          <p className="text-gray-500 text-sm">No donors in this period.</p>
        ) : (
          <div className="space-y-3">
            {aggregates.topDonors.map((donor, idx) => (
              <div
                key={donor.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      idx === 0
                        ? 'bg-church-gold'
                        : idx === 1
                        ? 'bg-gray-400'
                        : idx === 2
                        ? 'bg-amber-700'
                        : 'bg-church-navy'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-mono text-church-navy">
                      {donor.id}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {donor.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-church-navy">
                    {formatCurrency(donor.total)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {donor.count} gift{donor.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer link to Payments */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link
            to="/admin/payments"
            className="text-sm text-church-navy hover:text-church-gold inline-flex items-center gap-1 transition"
          >
            View all giving transactions
            <ArrowForward className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminGiving;