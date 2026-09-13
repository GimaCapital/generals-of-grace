// frontend\src\App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layout
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Pages - Public
import Home from './components/pages/Home';
import About from './components/pages/About';
import SoulWinning from './components/pages/SoulWinning';
import Sermons from './components/pages/Sermons';
import SermonDetail from './components/pages/SermonDetail';
import Events from './components/pages/Events';
import EventDetail from './components/pages/EventDetail';
import Give from './components/pages/Give';
import GiveSuccess from './components/pages/GiveSuccess';
import OrderConfirmation from './components/pages/OrderConfirmation';
import Ministries from './components/pages/Ministries';
import MinistryDetail from './components/pages/MinistryDetail';
import Contact from './components/pages/Contact';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ResetPassword from './components/pages/ResetPassword';
import NotFound from './components/pages/NotFound';

import PastorSocial from './components/pages/PastorSocial';
import ChurchSocial from './components/pages/ChurchSocial';

import Testimonies from './components/pages/Testimonies';
import SubmitTestimony from './components/pages/SubmitTestimony';

// Pages - Admin
import AdminDashboard from './components/admin/Dashboard';
import AdminSermons from './components/admin/Sermons';
import AdminEvents from './components/admin/Events';
import AdminGiving from './components/admin/Giving';
import AdminUsers from './components/admin/Users';
import AdminSettings from './components/admin/Settings';
import { SettingsProvider } from './context/SettingsContext';
import ManageMinistries from './components/admin/ManageMinistries';
import AdminTestimonies from './components/admin/Testimonies';
import BookPurchase from './components/pages/BookPurchase';
import Books from './components/pages/Books';
import AdminBooks from './components/admin/Books';
import AdminPayments from './components/admin/Payments';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
       <SettingsProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="soul-winning" element={<SoulWinning />} />
              <Route path="sermons" element={<Sermons />} />
              <Route path="sermons/:id" element={<SermonDetail />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="give" element={<Give />} />
              <Route path="ministries" element={<Ministries />} />
              <Route path="ministries/:id" element={<MinistryDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="pastor-social" element={<PastorSocial />} />
              <Route path="church-social" element={<ChurchSocial />} />
              <Route path="give/success" element={<GiveSuccess />} />
              <Route path="books/:bookSlug" element={<BookPurchase />} />
              <Route path="/books" element={<Books />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="testimonies" element={<Testimonies />} />
              <Route path="submit-testimony" element={<SubmitTestimony />} />   
            </Route>
          

            {/* Admin Routes with AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="sermons" element={<AdminSermons />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="giving" element={<AdminGiving />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="/admin/ministries" element={<ManageMinistries />} />
              <Route path="testimonies" element={<AdminTestimonies />} />
              <Route path="books" element={<AdminBooks />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;