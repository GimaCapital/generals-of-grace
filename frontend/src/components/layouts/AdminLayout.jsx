import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dashboard as DashboardIcon,
  VideoLibrary as SermonsIcon,
  Event as EventsIcon,
  Payments as GivingIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/admin/sermons', icon: <SermonsIcon />, label: 'Sermons' },
    { path: '/admin/events', icon: <EventsIcon />, label: 'Events' },
    { path: '/admin/giving', icon: <GivingIcon />, label: 'Giving' },
    { path: '/admin/users', icon: <UsersIcon />, label: 'Users' },
    { path: '/admin/settings', icon: <SettingsIcon />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-church-navy text-white transition-all duration-300 fixed h-full z-50`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-display font-bold">Admin Panel</h1>
          ) : (
            <span className="text-2xl">⚡</span>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full hover:bg-gray-700 transition-colors mt-4 border-t border-gray-700"
          >
            <span className="text-2xl"><LogoutIcon /></span>
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;