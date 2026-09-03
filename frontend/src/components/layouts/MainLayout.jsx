// src/components/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import MobileMenu from '../common/MobileMenu';
import ScrollToTop from '../common/ScrollToTop';

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    // ✅ FIX: Added overflow-x-hidden to prevent horizontal scroll
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <ScrollToTop />
      <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;