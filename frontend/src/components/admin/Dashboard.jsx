// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sermonAPI, givingAPI, eventAPI, userAPI } from '../../services/api';
import { 
  TrendingUp, 
  People, 
  VideoLibrary, 
  Event, 
  Payments,
  ArrowUpward,
  ArrowDownward  
} from '@mui/icons-material';

// ✅ Import utility functions
import { formatCurrency, formatDate } from '../../utils';

function AdminDashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    sermons: 0,
    events: 0,
    users: 0,
    giving: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentGiving, setRecentGiving] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // console.log('🔍 Fetching dashboard data...');
      
      // ✅ Fetch users
      const usersRes = await userAPI.getAll();
      // console.log('📊 Users response:', usersRes.data);
      
      // ✅ Get user count
      let userCount = 0;
      if (Array.isArray(usersRes.data)) {
        userCount = usersRes.data.length;
      } else if (usersRes.data?.data && Array.isArray(usersRes.data.data)) {
        userCount = usersRes.data.data.length;
      } else if (usersRes.data?.pagination?.total) {
        userCount = usersRes.data.pagination.total;
      }
      
      // ✅ Fetch sermons and events
      const [sermonsRes, eventsRes] = await Promise.all([
        sermonAPI.getAll({ limit: 1 }),
        eventAPI.getAll({ limit: 1 })
      ]);

      // ✅ Get sermon count
      let sermonCount = 0;
      if (sermonsRes.data?.pagination?.total) {
        sermonCount = sermonsRes.data.pagination.total;
      } else if (sermonsRes.data?.data?.length) {
        sermonCount = sermonsRes.data.data.length;
      }

      // ✅ Get event count
      let eventCount = 0;
      if (eventsRes.data?.pagination?.total) {
        eventCount = eventsRes.data.pagination.total;
      } else if (eventsRes.data?.data?.length) {
        eventCount = eventsRes.data.data.length;
      }

      // ✅ Fetch ALL giving records (limit 1000 to get all)
      const historyRes = await givingAPI.getHistory({ limit: 1000 });
      
      // console.log('📊 Recent giving response:', historyRes.data);
      
      // ✅ Get the data array
      const givingData = historyRes.data?.data || [];
      
      // ✅ Show ALL giving records (no slice, show all)
      setRecentGiving(givingData);
      
      // ✅ Calculate total from ALL giving records
      const totalGiving = givingData.reduce((sum, item) => sum + (item.amount || 0), 0);
      // console.log('📊 Total giving calculated:', totalGiving);
      // console.log('📊 Number of records:', givingData.length);

      setStats({
        sermons: sermonCount,
        events: eventCount,
        users: userCount,
        giving: totalGiving,
      });
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Sermons', 
      value: stats.sermons, 
      icon: <VideoLibrary className="text-3xl" />,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Total Events', 
      value: stats.events, 
      icon: <Event className="text-3xl" />,
      color: 'bg-purple-500',
      change: '+5%',
      trend: 'up'
    },
    { 
      title: 'Members', 
      value: stats.users, 
      icon: <People className="text-3xl" />,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'Total Giving', 
      value: formatCurrency(stats.giving),
      icon: <Payments className="text-3xl" />,
      color: 'bg-church-gold',
      change: '+15%',
      trend: 'up'
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
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-church-navy">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userProfile?.displayName || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-church-navy mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpward className="w-4 h-4" /> : <ArrowDownward className="w-4 h-4" />}
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

      {/* Recent Giving - Shows ALL records */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-display font-bold text-church-navy mb-4">Recent Giving</h2>
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
                </tr>
              </thead>
              <tbody>
                {recentGiving.map((giving) => (
                  <tr key={giving.id} className="border-b last:border-0">
                    <td className="py-3 text-sm font-mono">{giving.titheNumber || 'N/A'}</td>
                    <td className="py-3 text-sm font-semibold">{formatCurrency(giving.amount)}</td>
                    <td className="py-3 text-sm capitalize">{giving.type || 'N/A'}</td>
                    <td className="py-3 text-sm">{giving.date ? formatDate(giving.date) : 'N/A'}</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        giving.status === 'successful' 
                          ? 'bg-green-100 text-green-800' 
                          : giving.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {giving.status || 'pending'}
                      </span>
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