// src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dashboard as DashboardIcon,
  VideoLibrary as SermonsIcon,
  Event as EventsIcon,
  Favorite as GivingIcon,
  ReceiptLong as PaymentsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Church as MinistriesIcon,
  Chat as TestimoniesIcon,
  MenuBook as BooksIcon,
} from '@mui/icons-material';

const menuItems = [
  { path: '/admin', icon: <DashboardIcon />, label: 'Dashboard', exact: true },
  { path: '/admin/sermons', icon: <SermonsIcon />, label: 'Sermons' },
  { path: '/admin/events', icon: <EventsIcon />, label: 'Events' },
  { path: '/admin/giving', icon: <GivingIcon />, label: 'Giving' },
  { path: '/admin/payments', icon: <PaymentsIcon />, label: 'Payments' },
  { path: '/admin/ministries', icon: <MinistriesIcon />, label: 'Ministries' },
  { path: '/admin/testimonies', icon: <TestimoniesIcon />, label: 'Testimonies' },
  { path: '/admin/books', icon: <BooksIcon />, label: 'Books' },
  { path: '/admin/users', icon: <UsersIcon />, label: 'Users' },
  { path: '/admin/settings', icon: <SettingsIcon />, label: 'Settings' },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 transition-colors ${
      isActive
        ? 'bg-church-gold/20 border-l-4 border-church-gold text-white'
        : 'border-l-4 border-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ============================================ */}
      {/* SIDEBAR — desktop (always visible, collapsible) */}
      {/* ============================================ */}
      <aside
        className={`hidden lg:flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-church-navy text-white transition-all duration-300 fixed h-full z-40`}
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          menuItems={menuItems}
          navLinkClass={navLinkClass}
          handleLogout={handleLogout}
        />
      </aside>

      {/* ============================================ */}
      {/* SIDEBAR — mobile (drawer + overlay) */}
      {/* ============================================ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-church-navy text-white z-50 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-display font-bold">Admin Portal</h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="mt-6 overflow-y-auto h-[calc(100%-80px)] pb-24">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={navLinkClass}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mt-4 border-t border-gray-700"
          >
            <span className="text-2xl">
              <LogoutIcon />
            </span>
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Mobile top bar with hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <h1 className="font-display font-bold text-church-navy">
            Admin Portal
          </h1>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// ============================================
// SIDEBAR CONTENT (desktop) — extracted for clarity
// ============================================
function SidebarContent({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  navLinkClass,
  handleLogout,
}) {
  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {sidebarOpen ? (
          <h1 className="text-xl font-display font-bold">Admin Portal</h1>
        ) : (
          <span className="text-2xl">⚡</span>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 hover:bg-gray-700 rounded"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav className="mt-6 overflow-y-auto flex-1 pb-24">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={navLinkClass}
            title={!sidebarOpen ? item.label : undefined}
          >
            <span className="text-2xl">{item.icon}</span>
            {sidebarOpen && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors mt-4 border-t border-gray-700"
        >
          <span className="text-2xl">
            <LogoutIcon />
          </span>
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </nav>
    </>
  );
}

export default AdminLayout;