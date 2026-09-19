// frontend/src/components/dashboard/tabs/OrdersTab.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { orderAPI } from '../../../services/api';
import { formatCurrency, formatDate, toDate } from '../../../utils';

function OrdersTab() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      if (!currentUser?.uid) return;
      try {
        const res = await orderAPI.getUserOrders(currentUser.uid).catch(() => ({ data: { data: [] } }));
        const data = res.data?.data || [];
        setOrders([...data].sort((a, b) => {
          const aT = toDate(a.createdAt)?.getTime() || 0;
          const bT = toDate(b.createdAt)?.getTime() || 0;
          return bT - aT;
        }));
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader className="w-6 h-6 text-gray-400 animate-spin" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
        <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 mb-4">No orders yet</p>
        <Link
          to="/books"
          className="inline-flex items-center gap-1.5 text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Order #</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {toDate(o.createdAt) ? formatDate(toDate(o.createdAt)) : '—'}
                </td>
                <td className="px-6 py-3 text-xs text-gray-500 font-mono">
                  {o.orderNumber || o.id?.slice(0, 8)}
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  {o.items?.map((it) => it.title).join(', ') || '—'}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right tabular-nums whitespace-nowrap">
                  {formatCurrency(o.total || 0)}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800'
                    : o.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                    {o.paymentStatus || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 capitalize">{o.status || 'pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTab;