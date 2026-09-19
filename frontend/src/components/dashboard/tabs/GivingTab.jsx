// frontend/src/components/dashboard/tabs/GivingTab.jsx
import React, { useState, useEffect } from 'react';
import { Loader, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { givingAPI } from '../../../services/api';
import { formatCurrency, formatDate, toDate, getGivingTypeLabel, getGivingStatusMeta } from '../../../utils';

function GivingTab() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      if (!currentUser?.uid) return;
      try {
        const [historyRes, totalRes] = await Promise.all([
          givingAPI.getHistory({ limit: 100 }).catch(() => ({ data: { data: [] } })),
          givingAPI.getUserTotal().catch(() => ({ data: { data: { total: 0 } } })),
        ]);
        const data = historyRes.data?.data || [];
        setRecords([...data].sort((a, b) => {
          const aT = toDate(a.paidAt || a.date || a.createdAt)?.getTime() || 0;
          const bT = toDate(b.paidAt || b.date || b.createdAt)?.getTime() || 0;
          return bT - aT;
        }));
        setTotal(totalRes.data?.data?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader className="w-6 h-6 text-gray-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Given</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{formatCurrency(total)}</p>
          <p className="text-xs text-gray-500 mt-1">Lifetime</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Records</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{records.length}</p>
          <p className="text-xs text-gray-500 mt-1">All giving attempts</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to="/give"
          className="inline-flex items-center gap-1.5 text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <Gift className="w-4 h-4" />
          Give Now
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {records.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">No giving records yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((g) => {
                  const meta = getGivingStatusMeta(g.status);
                  const date = toDate(g.paidAt || g.date || g.createdAt);
                  return (
                    <tr key={g.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {date ? formatDate(date) : '—'}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500 font-mono">{g.reference || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{getGivingTypeLabel(g.type)}</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right tabular-nums whitespace-nowrap">
                        {formatCurrency(g.amount)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${meta.tableBadge}`}>
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GivingTab;