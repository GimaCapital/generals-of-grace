// frontend/src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sermonAPI, givingAPI, eventAPI, userAPI, orderAPI } from '../../services/api';
import {
  People,
  VideoLibrary,
  Event,
  Payments,
  ArrowUpward,
  ArrowDownward,
  CreditCard,
  ShoppingCart,
  AttachMoney,
  Pending,
  ArrowForward,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils';

/**
 * Admin Dashboard — high-level overview only.
 *
 * For transaction-level detail (fees, net settlement, provider refs,
 * full filterable tables), see /admin/payments.
 *
 * Data sources:
 *   - Members, Sermons, Events → their respective APIs
 *   - Total Giving → sum of giving.amount
 *   - Total Orders → count of orders (all)
 *   - Orders Revenue → sum of orders where paymentStatus === 'paid'
 *   - Combined Revenue → Total Giving + Orders Revenue
 */

const RECENT_LIMIT = 5;

function AdminDashboard() {
  const { userProfile } = useAuth();

  const [stats, setStats] = useState({
    sermons: 0,
    events: 0,
    users: 0,
    giving: 0,
  });

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentGiving, setRecentGiving] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ---- Users ----
      let userCount = 0;
      try {
        const usersRes = await userAPI.getAll();
        if (Array.isArray(usersRes.data)) {
          userCount = usersRes.data.length;
        } else if (usersRes.data?.data && Array.isArray(usersRes.data.data)) {
          userCount = usersRes.data.data.length;
        } else if (usersRes.data?.pagination?.total) {
          userCount = usersRes.data.pagination.total;
        }
      } catch (err) {
        console.warn('Could not fetch users:', err?.response?.status);
      }

      // ---- Sermons + Events ----
      let sermonCount = 0;
      let eventCount = 0;
      try {
        const [sermonsRes, eventsRes] = await Promise.all([
          sermonAPI.getAll({ limit: 1 }),
          eventAPI.getAll({ limit: 1 }),
        ]);

        if (sermonsRes.data?.pagination?.total) {
          sermonCount = sermonsRes.data.pagination.total;
        } else if (sermonsRes.data?.data?.length) {
          sermonCount = sermonsRes.data.data.length;
        }

        if (eventsRes.data?.pagination?.total) {
          eventCount = eventsRes.data.pagination.total;
        } else if (eventsRes.data?.data?.length) {
          eventCount = eventsRes.data.data.length;
        }
      } catch (err) {
        console.warn('Could not fetch sermons/events:', err?.response?.status);
      }

      // ---- Giving ----
      let givingData = [];
      try {
        const historyRes = await givingAPI.getHistory({ limit: 1000 });
        givingData = historyRes.data?.data || [];
        setRecentGiving(givingData.slice(0, RECENT_LIMIT));
      } catch (err) {
        console.warn('Could not fetch giving history:', err?.response?.status);
      }

      const totalGiving = givingData.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );

      // ---- Orders ----
      try {
        const ordersStatsRes = await orderAPI.getStats();
        const d = ordersStatsRes.data?.data || {};
        setOrderStats({
          totalOrders: d.totalOrders || 0,
          totalRevenue: d.totalRevenue || 0,
          pendingOrders: d.pendingOrders || 0,
        });

        try {
          const ordersListRes = await orderAPI.getAll({
            limit: RECENT_LIMIT,
          });
          setRecentOrders(ordersListRes.data?.data || []);
        } catch (err) {
          console.warn(
            'Could not fetch recent orders:',
            err?.response?.status
          );
        }
      } catch (err) {
        console.warn('Could not fetch order stats:', err?.response?.status);
      }

      setStats({
        sermons: sermonCount,
        events: eventCount,
        users: userCount,
        giving: totalGiving,
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const combinedRevenue = stats.giving + orderStats.totalRevenue;

  const statCards = [
    {
      title: 'Total Sermons',
      value: stats.sermons,
      icon: <VideoLibrary className="text-3xl" />,
      color: 'bg-blue-500',
      change: 'Lifetime',
      trend: 'up',
    },
    {
      title: 'Total Events',
      value: stats.events,
      icon: <Event className="text-3xl" />,
      color: 'bg-purple-500',
      change: 'Lifetime',
      trend: 'up',
    },
    {
      title: 'Members',
      value: stats.users,
      icon: <People className="text-3xl" />,
      color: 'bg-green-500',
      change: 'Lifetime',
      trend: 'up',
    },
    {
      title: 'Total Giving',
      value: formatCurrency(stats.giving),
      icon: <Payments className="text-3xl" />,
      color: 'bg-church-gold',
      change: 'Lifetime',
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: orderStats.totalOrders,
      icon: <ShoppingCart className="text-3xl" />,
      color: 'bg-indigo-500',
      change: `${orderStats.pendingOrders} pending`,
      trend: 'up',
    },
  ];

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
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-church-navy">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {userProfile?.displayName || 'Admin'}!
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 text-sm text-white bg-church-navy px-3 py-1 rounded-full">
            <AttachMoney className="w-4 h-4 text-church-gold" />
            Combined Revenue:{' '}
            <span className="font-semibold">
              {formatCurrency(combinedRevenue)}
            </span>
          </div>

          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-2 text-sm text-church-navy bg-church-gold/10 hover:bg-church-gold/20 border border-church-gold/30 px-3 py-1 rounded-full transition"
          >
            <Payments className="w-4 h-4" />
            View All Payments
            <ArrowForward className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-church-navy mt-1">
                  {stat.value}
                </p>
                <div
                  className={`flex items-center mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpward className="w-4 h-4" />
                  ) : (
                    <ArrowDownward className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT GIVING */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-church-navy">
            Recent Giving
          </h2>
          <Link
            to="/admin/payments"
            className="text-sm text-church-navy hover:text-church-gold inline-flex items-center gap-1 transition"
          >
            View all
            <ArrowForward className="w-4 h-4" />
          </Link>
        </div>

        {recentGiving.length === 0 ? (
          <p className="text-gray-500">No recent giving records</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2 font-medium">Tithe Number</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Provider</th>
                </tr>
              </thead>
              <tbody>
                {recentGiving.map((giving) => (
                  <tr key={giving.id} className="border-b last:border-0">
                    <td className="py-3 text-sm font-mono">
                      {giving.titheNumber || 'N/A'}
                    </td>
                    <td className="py-3 text-sm font-semibold">
                      {formatCurrency(giving.amount)}
                    </td>
                    <td className="py-3 text-sm capitalize">
                      {giving.type || 'N/A'}
                    </td>
                    <td className="py-3 text-sm">
                      {giving.date ? formatDate(giving.date) : 'N/A'}
                    </td>
                    <td className="py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          giving.status === 'successful'
                            ? 'bg-green-100 text-green-800'
                            : giving.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {giving.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <span className="text-xs font-medium capitalize flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        {giving.provider || 'flutterwave'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-church-navy">
            Recent Orders
          </h2>
          <div className="flex items-center gap-3">
            {orderStats.pendingOrders > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                <Pending className="w-3 h-3" />
                {orderStats.pendingOrders} pending
              </span>
            )}
            <Link
              to="/admin/payments"
              className="text-sm text-church-navy hover:text-church-gold inline-flex items-center gap-1 transition"
            >
              View all
              <ArrowForward className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2 font-medium">Order #</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Payment</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 text-sm font-mono">
                      {order.orderNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="py-3 text-sm">
                      <div className="font-medium text-church-navy">
                        {order.customerName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerEmail || ''}
                      </div>
                    </td>
                    <td className="py-3 text-sm font-semibold">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="py-3 text-sm">
                      <span className="text-xs font-medium capitalize flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        {order.paymentMethod || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ||
                          order.status === 'shipped'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'confirmed' ||
                              order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'cancelled' ||
                              order.status === 'refunded'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      {order.createdAt
                        ? formatDate(
                            order.createdAt._seconds
                              ? new Date(
                                  order.createdAt._seconds * 1000
                                ).toISOString()
                              : order.createdAt
                          )
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;