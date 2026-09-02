import React, { useState, useEffect } from 'react';
import { givingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Download, Search, Filter } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils'; // ✅ Import utilities

function AdminGiving() {
  const [givingHistory, setGivingHistory] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byType: {},
    count: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchGivingData();
  }, []);

  const fetchGivingData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        givingAPI.getHistory({ limit: 100 }),
        givingAPI.getStats()
      ]);
      
      const historyData = historyRes.data?.data || [];
      setGivingHistory(historyData);
      
      // Calculate stats from history data
      const total = historyData.reduce((sum, item) => sum + (item.amount || 0), 0);
      const byType = {};
      historyData.forEach(item => {
        const type = item.type || 'unknown';
        byType[type] = (byType[type] || 0) + (item.amount || 0);
      });
      
      setStats({
        total: total,
        byType: byType,
        count: historyData.length
      });
    } catch (error) {
      // console.error('Error fetching giving data:', error);
      toast.error('Error loading giving data');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = givingHistory.filter(item => {
    const matchesSearch = 
      item.titheNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownloadReceipt = async (id) => {
    try {
      const response = await givingAPI.generateReceipt(id);
      const link = document.createElement('a');
      link.href = response.data.receiptUrl;
      link.download = `receipt-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Receipt downloaded!');
    } catch (error) {
      // console.error('Error downloading receipt:', error);
      toast.error('Error downloading receipt');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-church-navy mb-6">Giving Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Total Giving</p>
          <p className="text-3xl font-bold text-church-navy">{formatCurrency(stats.total)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-3xl font-bold text-church-navy">{stats.count || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500">By Type</p>
          <div className="space-y-1 mt-1">
            {Object.entries(stats.byType || {}).map(([type, amount]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="capitalize">{type}</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tithe number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="tithe">Tithe</option>
              <option value="offering">Offering</option>
              <option value="building">Building Fund</option>
              <option value="mission">Missions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Giving History Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">Tithe Number</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No giving records found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-sm">{item.titheNumber || 'N/A'}</td>
                    <td className="px-6 py-3 font-semibold">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-3 capitalize">{item.type || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">
                      {item.date ? formatDate(item.date) : 'N/A'}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'successful' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {item.receiptUrl && (
                        <button
                          onClick={() => handleDownloadReceipt(item.id)}
                          className="p-2 text-church-gold hover:bg-church-gold/10 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminGiving;