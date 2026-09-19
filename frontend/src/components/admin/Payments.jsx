// frontend/src/components/admin/Payments.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Payments as PaymentsIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as UssdIcon,
} from '@mui/icons-material';
import { givingAPI, orderAPI } from '../../services/api';
import { formatCurrency, formatDate, formatDateTimeFull } from '../../utils';

// ============================================================
// CONSTANTS
// ============================================================
const PAGE_SIZE = 20;

const GIVING_TYPES = [
  'tithe',
  'offering',
  'building',
  'mission',
  'seed',
  'thanksgiving',
  'prophetic-seed',
  'pastors-gift',
  'custom',
];

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'refunded',
];

const PROVIDERS = ['flutterwave', 'paystack', 'cash', 'bank_transfer'];

// ============================================================
// HELPERS
// ============================================================
const safeNumber = (v) => (typeof v === 'number' && !isNaN(v) ? v : 0);

const getGivingFee = (g) => {
  const td = g?.transactionData || {};
  // Flutterwave: app_fee / merchant_fee (already in Naira)
  if (td.app_fee) return safeNumber(td.app_fee);
  if (td.merchant_fee) return safeNumber(td.merchant_fee);
  // Paystack: fees is in kobo → convert to Naira
  if (td.fees) return safeNumber(td.fees) / 100;
  return 0;
};

const getGivingNet = (g) => {
  const gross = safeNumber(g?.amount);
  const fee = getGivingFee(g);
  return Math.max(0, gross - fee);
};

const getOrderFee = (o) => {
  const pr = o?.paymentResponse || {};
  // Flutterwave: app_fee / merchant_fee (already in Naira)
  if (pr.app_fee) return safeNumber(pr.app_fee);
  if (pr.merchant_fee) return safeNumber(pr.merchant_fee);
  // Paystack: fees is in kobo
  if (pr.fees) return safeNumber(pr.fees) / 100;
  return 0;
};

const getOrderNet = (o) => {
  const pr = o?.paymentResponse || {};

  // Flutterwave stores amount_settled directly (in Naira)
  const settled = safeNumber(pr.amount_settled);
  if (settled > 0) return settled;

  // Paystack: amount - fees, both in kobo
  const paystackAmount = safeNumber(pr.amount) / 100;
  const paystackFees = safeNumber(pr.fees) / 100;
  if (paystackAmount > 0) {
    return Math.max(0, paystackAmount - paystackFees);
  }

  // Fallback
  const gross = safeNumber(o?.total);
  const fee = getOrderFee(o);
  return Math.max(0, gross - fee);
};

/**
 * Reads a field from EITHER Flutterwave or Paystack payload shape.
 * Flutterwave uses flat fields (auth_model, payment_type, processor_response).
 * Paystack nests under `authorization` and uses `channel` + `gateway_response`.
 */
const readProviderField = (raw, key) => {
  const pr = raw?.paymentResponse || {};
  const td = raw?.transactionData || {};

  const sources = [pr, td];

  for (const src of sources) {
    if (!src) continue;
    switch (key) {
      case 'auth_model':
        if (src.auth_model) return src.auth_model;
        if (src.authorization?.channel)
          return String(src.authorization.channel).toUpperCase();
        if (src.authorization?.card_type) return src.authorization.card_type;
        break;
      case 'payment_type':
        if (src.payment_type) return src.payment_type;
        if (src.channel) return src.channel;
        if (src.authorization?.channel) return src.authorization.channel;
        break;
      case 'processor_response':
        if (src.processor_response) return src.processor_response;
        if (src.gateway_response) return src.gateway_response;
        if (src.status) return src.status;
        break;
      case 'charged_amount':
        if (src.charged_amount) return safeNumber(src.charged_amount);
        if (src.amount) return safeNumber(src.amount) / 100;
        break;
      case 'merchant_fee':
        return safeNumber(src.merchant_fee);
      case 'flw_ref':
        return src.flw_ref || src.reference || null;
      default:
        return null;
    }
  }
  return null;
};

const getOrderMethod = (o) =>
  o?.paymentResponse?.authorization?.channel ||
  o?.paymentResponse?.channel ||
  o?.paymentResponse?.payment_type ||
  o?.paymentMethod ||
  '—';

const getGivingMethod = (g) =>
  g?.transactionData?.payment_type ||
  g?.transactionData?.channel ||
  g?.paymentMethod ||
  g?.provider ||
  '—';

const getProviderRef = (row) =>
  row?.transactionData?.flw_ref ||
  row?.paymentResponse?.flw_ref ||
  row?.paymentResponse?.reference ||
  row?.flutterwaveRef ||
  row?.paystackRef ||
  row?.reference ||
  row?.paymentReference ||
  '—';

const toCSV = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = String(v ?? '');
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ];
  return lines.join('\n');
};

const downloadCSV = (filename, csv) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ✅ NEW HELPER — formats item types for the Items column
const formatItemsShort = (items) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  const types = [...new Set(items.map((it) => it.type).filter(Boolean))];
  if (types.length === 0) return '—';
  if (types.length === 1) {
    const t = types[0];
    const totalQty = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
    return totalQty > 1 ? `${t}s` : t;
  }
  return `${types[0]} +${types.length - 1} more`;
};

const getMethodIcon = (method) => {
  const m = String(method || '').toLowerCase();
  if (m.includes('bank') || m.includes('transfer') || m.includes('account'))
    return <BankIcon className="w-4 h-4" />;
  if (m.includes('ussd')) return <UssdIcon className="w-4 h-4" />;
  return <CreditCardIcon className="w-4 h-4" />;
};

// ============================================================
// SUBCOMPONENTS
// ============================================================
function SummaryTile({ label, value, accent = 'navy', sub }) {
  const colorMap = {
    navy: 'bg-church-navy text-white',
    gold: 'bg-church-gold text-white',
    green: 'bg-green-600 text-white',
    red: 'bg-red-600 text-white',
    slate: 'bg-slate-700 text-white',
  };
  return (
    <div className={`rounded-xl shadow-md p-4 ${colorMap[accent]}`}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs opacity-75 mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  const styles = {
    successful: 'bg-green-100 text-green-800',
    success: 'bg-green-100 text-green-800',
    paid: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
    payment_failed: 'bg-red-100 text-red-800',
  };
  const cls = styles[s] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status || 'unknown'}
    </span>
  );
}

function SkeletonRows({ cols, rows = 6 }) {
  return Array.from({ length: rows }).map((_, r) => (
    <tr key={r} className="border-b last:border-0">
      {Array.from({ length: cols }).map((__, c) => (
        <td key={c} className="py-3 px-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  ));
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <PaymentsIcon className="w-12 h-12 mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 text-red-800">
        <WarningIcon />
        <span className="text-sm">{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-church-navy break-all">{value ?? '—'}</p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function AdminPayments() {
  const [tab, setTab] = useState('giving');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [giving, setGiving] = useState([]);
  const [orders, setOrders] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('all');
  const [status, setStatus] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination + expand
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // ============================================================
  // FETCH
  // ============================================================
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [givingRes, ordersRes] = await Promise.all([
        givingAPI.getHistory({ limit: 1000 }).catch((e) => {
          console.warn('giving fetch failed:', e?.response?.status);
          return { data: { data: [] } };
        }),
        orderAPI.getAll({ limit: 1000 }).catch((e) => {
          console.warn('orders fetch failed:', e?.response?.status);
          return { data: { data: [] } };
        }),
      ]);

      const givingData = givingRes.data?.data || [];
      const ordersData = ordersRes.data?.data || [];

      setGiving(Array.isArray(givingData) ? givingData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error('Payments fetch error:', err);
      setError(err?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Reset filters when tab changes
  useEffect(() => {
    setSearch('');
    setProvider('all');
    setStatus('all');
    setTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
    setExpandedId(null);
  }, [tab]);

  // ============================================================
  // DERIVED ROWS
  // ============================================================
  const rawRows = useMemo(() => {
    if (tab === 'giving') {
      return giving.map((g) => ({
        id: g.id,
        source: 'giving',
        date: g.paidAt || g.date || g.createdAt,
        reference: g.reference || g.flutterwaveRef || g.paystackRef || '—',
        titheNumber: g.titheNumber || '—',
        customer: g.email || '—',
        type: g.type || 'custom',
        provider: g.provider || g.paymentMethod || '—',
        method: getGivingMethod(g),
        gross: safeNumber(g.amount),
        fee: getGivingFee(g),
        net: getGivingNet(g),
        status: g.status || 'pending',
        providerRef: getProviderRef(g),
        raw: g,
      }));
    }
    return orders.map((o) => ({
      id: o.id,
      source: 'order',
      date: o.paymentResponse?.paid_at || o.paidAt || o.createdAt,
      reference: o.orderNumber || o.id?.slice(0, 8) || '—',
      titheNumber: o.userId ? o.userId.slice(0, 8) : '—',
      customer: o.customerName || o.customerEmail || '—',
      type: formatItemsShort(o.items),
      provider: o.paymentProvider || o.paymentMethod || '—',
      method: getOrderMethod(o),
      gross: safeNumber(o.total),
      fee: getOrderFee(o),
      net: getOrderNet(o),
      status: o.paymentStatus || o.status || 'pending',
      fulfillmentStatus: o.status || 'pending',
      providerRef: getProviderRef(o),
      raw: o,
    }));
  }, [tab, giving, orders]);

  // ============================================================
  // FILTERS
  // ============================================================
  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() + 86400000 : null;

    return rawRows.filter((r) => {
      if (s) {
        const hay = [r.reference, r.titheNumber, r.customer, r.providerRef]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(s)) return false;
      }

      if (provider !== 'all' && r.provider !== provider) return false;
      if (status !== 'all' && r.status !== status) return false;

      if (tab === 'giving' && typeFilter !== 'all' && r.type !== typeFilter)
        return false;
      if (
        tab === 'orders' &&
        typeFilter !== 'all' &&
        r.fulfillmentStatus !== typeFilter
      )
        return false;

      if (from || to) {
        let ts = null;
        const d = r.date;
        if (d && typeof d === 'object' && d._seconds) {
          ts = d._seconds * 1000;
        } else if (d) {
          ts = new Date(d).getTime();
        }
        if (!ts || isNaN(ts)) return false;
        if (from && ts < from) return false;
        if (to && ts > to) return false;
      }

      return true;
    });
  }, [rawRows, search, provider, status, typeFilter, dateFrom, dateTo, tab]);

  // ============================================================
  // SORTING
  // ============================================================
  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    const dir = sortDir === 'asc' ? 1 : -1;

    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }

      if (sortKey === 'date') {
        const toMs = (v) => {
          if (!v) return 0;
          if (typeof v === 'object' && v._seconds) return v._seconds * 1000;
          const t = new Date(v).getTime();
          return isNaN(t) ? 0 : t;
        };
        return (toMs(av) - toMs(bv)) * dir;
      }

      return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
    });

    return rows;
  }, [filteredRows, sortKey, sortDir]);

  // ============================================================
  // PAGINATION
  // ============================================================
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedRows.slice(start, start + PAGE_SIZE);
  }, [sortedRows, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // ============================================================
  // TOTALS
  // Industry standard:
  //   - Gross / Fees / Net → successful payments only
  //   - attempted → all records (for the "Total Attempted" tile)
  // ============================================================
  const totals = useMemo(() => {
    let gross = 0;
    let fee = 0;
    let net = 0;
    let count = 0;
    let successful = 0;
    let attempted = 0;

    filteredRows.forEach((r) => {
      count += 1;
      attempted += r.gross;

      const isSuccess =
        r.status === 'successful' ||
        r.status === 'success' ||
        r.status === 'paid';

      if (isSuccess) {
        gross += r.gross;
        fee += r.fee;
        net += r.net;
        successful += 1;
      }
    });

    return { gross, fee, net, count, successful, attempted };
  }, [filteredRows]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleExportCSV = () => {
    const rows = sortedRows.map((r) => ({
      Date: formatDateTimeFull(r.date),
      Reference: r.reference,
      TitheNumber: r.titheNumber,
      Customer: r.customer,
      Type: r.type,
      Provider: r.provider,
      Method: r.method,
      Gross: r.gross,
      Fee: r.fee,
      Net: r.net,
      Status: r.status,
      ProviderRef: r.providerRef,
    }));
    const csv = toCSV(rows);
    const filename = `${tab}-payments-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    downloadCSV(filename, csv);
  };

  const SortHeader = ({ label, k }) => (
    <th
      className="pb-2 px-3 font-medium cursor-pointer select-none hover:text-church-navy"
      onClick={() => toggleSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && (
          <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
        )}
      </span>
    </th>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-church-navy flex items-center gap-3">
          <PaymentsIcon className="text-4xl" />
          Payments
        </h1>
        <p className="text-gray-600 mt-1">
          All giving and book sales in one place — with fees, net settlement,
          and provider details.
        </p>
      </div>

      {/* ERROR */}
      {error && <ErrorBanner message={error} onRetry={fetchAll} />}

      {/* TABS */}
      <div className="flex items-center gap-2 mb-6 border-b">
        <button
          onClick={() => setTab('giving')}
          className={`px-4 py-2 font-medium text-sm -mb-px border-b-2 transition ${
            tab === 'giving'
              ? 'border-church-gold text-church-navy'
              : 'border-transparent text-gray-500 hover:text-church-navy'
          }`}
        >
          Giving ({giving.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 font-medium text-sm -mb-px border-b-2 transition ${
            tab === 'orders'
              ? 'border-church-gold text-church-navy'
              : 'border-transparent text-gray-500 hover:text-church-navy'
          }`}
        >
          Orders ({orders.length})
        </button>
        <div className="flex-1" />
        <button
          onClick={fetchAll}
          className="p-2 text-gray-500 hover:text-church-navy"
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* SUMMARY TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <SummaryTile
          label="Gross"
          value={formatCurrency(totals.gross)}
          accent="navy"
          sub="Successful only"
        />
        <SummaryTile
          label="Fees"
          value={formatCurrency(totals.fee)}
          accent="red"
          sub="Processor deductions"
        />
        <SummaryTile
          label="Net"
          value={formatCurrency(totals.net)}
          accent="green"
          sub="After fees"
        />
        <SummaryTile
          label="Total Attempted"
          value={formatCurrency(totals.attempted)}
          accent="slate"
          sub={`${totals.count} attempts`}
        />
        <SummaryTile
          label="Transactions"
          value={totals.count}
          accent="gold"
          sub={`${totals.successful} successful`}
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search ref, customer, tithe #"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-church-gold"
            />
          </div>

          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">All Providers</option>
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">All Statuses</option>
            {tab === 'giving' ? (
              <>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </>
            ) : (
              <>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </>
            )}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">
              {tab === 'giving' ? 'All Types' : 'All Fulfillment'}
            </option>
            {tab === 'giving'
              ? GIVING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace('-', ' ')}
                  </option>
                ))
              : ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('');
                setProvider('all');
                setStatus('all');
                setTypeFilter('all');
                setDateFrom('');
                setDateTo('');
                setPage(1);
              }}
              className="w-full px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              disabled={!sortedRows.length}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-church-navy text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              <DownloadIcon className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <table className="w-full">
            <tbody>
              <SkeletonRows cols={tab === 'giving' ? 11 : 11} />
            </tbody>
          </table>
        ) : sortedRows.length === 0 ? (
          <EmptyState
            message={
              rawRows.length === 0
                ? `No ${tab} yet`
                : 'No records match your filters'
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b bg-gray-50">
                    <th className="py-3 px-3 w-8" />
                    <SortHeader label="Date" k="date" />
                    <SortHeader
                      label={tab === 'giving' ? 'Reference' : 'Order #'}
                      k="reference"
                    />
                    <SortHeader
                      label={tab === 'giving' ? 'Tithe #' : 'Customer'}
                      k={tab === 'giving' ? 'titheNumber' : 'customer'}
                    />
                    {tab === 'giving' && (
                      <th className="pb-2 px-3 font-medium">Email</th>
                    )}
                    <th className="pb-2 px-3 font-medium">
                      {tab === 'giving' ? 'Type' : 'Items'}
                    </th>
                    <th className="pb-2 px-3 font-medium">Provider</th>
                    <th className="pb-2 px-3 font-medium">Method</th>
                    <SortHeader label="Gross" k="gross" />
                    <SortHeader label="Fee" k="fee" />
                    <SortHeader label="Net" k="net" />
                    <th className="pb-2 px-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((r) => {
                    const isOpen = expandedId === r.id;
                    return (
                      <React.Fragment key={r.id}>
                        <tr
                          className={`border-b last:border-0 hover:bg-gray-50 cursor-pointer ${
                            isOpen ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => setExpandedId(isOpen ? null : r.id)}
                        >
                          <td className="py-3 px-3 text-gray-400">
                            {isOpen ? (
                              <ExpandLessIcon fontSize="small" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" />
                            )}
                          </td>
                          <td className="py-3 px-3 text-sm whitespace-nowrap">
                            {formatDate(r.date)}
                          </td>
                          <td className="py-3 px-3 text-sm font-mono">
                            {r.reference}
                          </td>
                          <td className="py-3 px-3 text-sm">
                            {tab === 'giving' ? (
                              <span className="font-mono text-xs">
                                {r.titheNumber}
                              </span>
                            ) : (
                              <span className="font-medium">{r.customer}</span>
                            )}
                          </td>
                          {tab === 'giving' && (
                            <td className="py-3 px-3 text-sm">
                              <span className="text-xs text-gray-500">
                                {r.customer}
                              </span>
                            </td>
                          )}
                          <td className="py-3 px-3 text-sm capitalize">
                            {r.type.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-3 text-sm capitalize">
                            {r.provider}
                          </td>
                          <td className="py-3 px-3 text-sm">
                            <span className="inline-flex items-center gap-1 capitalize">
                              {getMethodIcon(r.method)}
                              {r.method.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm font-semibold whitespace-nowrap">
                            {formatCurrency(r.gross)}
                          </td>
                          <td className="py-3 px-3 text-sm text-red-600 whitespace-nowrap">
                            {r.fee ? `-${formatCurrency(r.fee)}` : '—'}
                          </td>
                          <td className="py-3 px-3 text-sm font-semibold text-green-700 whitespace-nowrap">
                            {formatCurrency(r.net)}
                          </td>
                          <td className="py-3 px-3 text-sm">
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>

                        {isOpen && (
                          <tr className="bg-gray-50 border-b">
                            <td colSpan={tab === 'giving' ? 12 : 11}>
                              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <Detail
                                  label="Provider Reference"
                                  value={r.providerRef}
                                />
                                <Detail label="Reference" value={r.reference} />

                                {tab === 'giving' ? (
                                  <>
                                    <Detail
                                      label="Tithe Number"
                                      value={r.titheNumber}
                                    />
                                    <Detail label="Email" value={r.customer} />
                                    <Detail
                                      label="Paid At"
                                      value={formatDateTimeFull(
                                        r.raw?.paidAt || r.raw?.date
                                      )}
                                    />
                                    <Detail
                                      label="Provider Response"
                                      value={
                                        readProviderField(
                                          r.raw,
                                          'processor_response'
                                        ) || '—'
                                      }
                                    />
                                    <Detail
                                      label="Payment Type"
                                      value={
                                        readProviderField(
                                          r.raw,
                                          'payment_type'
                                        ) || '—'
                                      }
                                    />
                                    <Detail
                                      label="Charged Amount"
                                      value={
                                        readProviderField(
                                          r.raw,
                                          'charged_amount'
                                        )
                                          ? formatCurrency(
                                              readProviderField(
                                                r.raw,
                                                'charged_amount'
                                              )
                                            )
                                          : formatCurrency(r.gross)
                                      }
                                    />
                                    <Detail
                                      label="Processor Fee"
                                      value={
                                        r.fee > 0
                                          ? `-${formatCurrency(r.fee)}`
                                          : '—'
                                      }
                                    />
                                    <Detail
                                      label="Net Received"
                                      value={formatCurrency(r.net)}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Detail
                                      label="Customer Email"
                                      value={r.raw?.customerEmail || '—'}
                                    />
                                    <Detail
                                      label="Phone"
                                      value={r.raw?.customerPhone || '—'}
                                    />
                                    <Detail
                                      label="Paid At"
                                      value={formatDateTimeFull(
                                        r.raw?.paymentResponse?.paid_at ||
                                          r.raw?.paidAt
                                      )}
                                    />
                                    <Detail
                                      label="Auth Model"
                                      value={
                                        readProviderField(
                                          r.raw,
                                          'auth_model'
                                        ) || '—'
                                      }
                                    />
                                    <Detail
                                      label="Payment Type"
                                      value={
                                        readProviderField(
                                          r.raw,
                                          'payment_type'
                                        ) || '—'
                                      }
                                    />
                                    <Detail
                                      label="Processor Response"
                                      value={
                                        readProviderField(
                                          r.raw,
                                          'processor_response'
                                        ) || '—'
                                      }
                                    />
                                    <Detail
                                      label="Items"
                                      value={
                                        (r.raw?.items || [])
                                          .map(
                                            (it) =>
                                              `${it.quantity}× ${it.title}`
                                          )
                                          .join(', ') || '—'
                                      }
                                    />
                                    <Detail
                                      label="Delivery"
                                      value={r.raw?.deliveryMethod || '—'}
                                    />
                                    <Detail
                                      label="Fulfillment"
                                      value={r.raw?.status || '—'}
                                    />
                                    <Detail
                                      label="Gross"
                                      value={formatCurrency(r.gross)}
                                    />
                                    <Detail
                                      label="Processor Fee"
                                      value={
                                        r.fee > 0
                                          ? `-${formatCurrency(r.fee)}`
                                          : '—'
                                      }
                                    />
                                    <Detail
                                      label="Net Settled"
                                      value={formatCurrency(r.net)}
                                    />
                                  </>
                                )}

                                {r.raw?.receiptUrl && (
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                      Receipt
                                    </p>
                                    <a
                                      href={r.raw.receiptUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-church-navy underline mt-1"
                                    >
                                      <ReceiptIcon className="w-4 h-4" />
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-sm">
              <span className="text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, sortedRows.length)} of{' '}
                {sortedRows.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded hover:bg-white disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded hover:bg-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPayments;