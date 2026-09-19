// frontend/src/components/dashboard/tabs/OverviewTab.jsx
import React, { useState, useEffect } from 'react';
import { Loader, TrendingUp, Users, Award, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { givingAPI, orderAPI, soulsAPI, badgesAPI, competitionsAPI } from '../../../services/api';
import { formatCurrency, formatDate, toDate, getGivingTypeLabel } from '../../../utils';

const StatTile = ({ label, value, sub, icon: Icon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className="text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  </div>
);

function OverviewTab({ onNavigate }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [givingTotal, setGivingTotal] = useState(0);
  const [givingCount, setGivingCount] = useState(0);
  const [soulsTotal, setSoulsTotal] = useState(0);
  const [badgesEarned, setBadgesEarned] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [activeComp, setActiveComp] = useState(null);
  const [recentGivings, setRecentGivings] = useState([]);

  useEffect(() => {
    (async () => {
      if (!currentUser?.uid) return;
      try {
        const [givingRes, soulsRes, badgeRes, ordersRes, compRes] = await Promise.all([
          givingAPI.getUserTotal().catch(() => ({ data: { data: { total: 0 } } })),
          soulsAPI.getStats(currentUser.uid).catch(() => ({ data: { data: { total: 0 } } })),
          badgesAPI.getProgress(currentUser.uid).catch(() => ({ data: { data: [] } })),
          orderAPI.getUserOrders(currentUser.uid).catch(() => ({ data: { data: [] } })),
          competitionsAPI.getActive().catch(() => ({ data: { data: [] } })),
        ]);

        setGivingTotal(givingRes.data?.data?.total || 0);

        const soulStats = soulsRes.data?.data || { total: 0 };
        setSoulsTotal(soulStats.total || 0);

        const badges = badgeRes.data?.data || [];
        setBadgesEarned(badges.filter((b) => b.earned).length);

        const orders = ordersRes.data?.data || [];
        setOrdersCount(orders.length);

        const comps = compRes.data?.data || [];
        if (comps.length > 0) {
          const first = comps[0];
          const detail = await competitionsAPI.getById(first.id).catch(() => null);
          if (detail?.data?.data) setActiveComp(detail.data.data);
        }

        const historyRes = await givingAPI.getHistory({ limit: 3 }).catch(() => ({ data: { data: [] } }));
        setRecentGivings(historyRes.data?.data || []);
      } catch (err) {
        console.error('Overview load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Given"
          value={formatCurrency(givingTotal)}
          sub="Successful giving"
          icon={TrendingUp}
        />
        <StatTile
          label="Souls Won"
          value={soulsTotal}
          sub="Lifetime"
          icon={Users}
        />
        <StatTile
          label="Badges Earned"
          value={badgesEarned}
          sub="Achievements"
          icon={Award}
        />
        <StatTile
          label="Orders"
          value={ordersCount}
          sub="Books & materials"
          icon={ShoppingBag}
        />
      </div>

      {/* ACTIVE COMPETITION */}
      {activeComp && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Active Competition
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">
                {activeComp.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{activeComp.description}</p>
            </div>
            <button
              onClick={() => onNavigate('competitions')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View →
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Church-wide progress</span>
              <span className="font-medium text-gray-900">
                {activeComp.churchTotal || 0} / {activeComp.goal} souls
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all"
                style={{
                  width: `${Math.min(100, ((activeComp.churchTotal || 0) / (activeComp.goal || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* RECENT GIVING */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Giving</h2>
          <button
            onClick={() => onNavigate('giving')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            View all →
          </button>
        </div>
        {recentGivings.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No giving yet
          </div>
        ) : (
          <table className="w-full">
            <tbody>
              {recentGivings.map((g) => (
                <tr key={g.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {toDate(g.paidAt || g.date || g.createdAt) ? formatDate(toDate(g.paidAt || g.date || g.createdAt)) : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {getGivingTypeLabel(g.type)}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(g.amount)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      g.status === 'successful' ? 'bg-green-100 text-green-800'
                      : g.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {g.status === 'successful' ? 'Received' : g.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OverviewTab;