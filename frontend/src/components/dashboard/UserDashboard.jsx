// frontend/src/components/dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Gift, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import OverviewTab from './tabs/OverviewTab';
import GivingTab from './tabs/GivingTab';
import SoulWinningTab from './tabs/SoulWinningTab';
import CompetitionsTab from './tabs/CompetitionsTab';
import OrdersTab from './tabs/OrdersTab';
import ProfileTab from './tabs/ProfileTab';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'giving', label: 'Giving' },
  { id: 'soul-winning', label: 'Soul Winning' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'orders', label: 'Orders' },
  { id: 'profile', label: 'Profile' },
];

function UserDashboard() {
  const { userProfile } = useAuth();
  const [searchParams] = useSearchParams();

  // Read ?tab= from URL, fallback to 'overview'
  const tabFromUrl = searchParams.get('tab');
  const initialTab = TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Keep tab in sync if URL changes (e.g. user clicks link from another page)
  useEffect(() => {
    const nextTab = searchParams.get('tab');
    if (nextTab && TABS.some((t) => t.id === nextTab)) {
      setActiveTab(nextTab);
    }
  }, [searchParams]);

  const firstName = userProfile?.displayName?.split(' ')[0] || 'Friend';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {firstName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/give"
              className="inline-flex items-center gap-1.5 text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              <Gift className="w-4 h-4" />
              Give Now
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 text-sm border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Books
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB CONTENT */}
        <div>
          {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
          {activeTab === 'giving' && <GivingTab />}
          {activeTab === 'soul-winning' && <SoulWinningTab />}
          {activeTab === 'competitions' && <CompetitionsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;