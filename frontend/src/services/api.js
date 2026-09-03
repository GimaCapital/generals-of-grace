// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Sermons API
// export const sermonAPI = {
//   getAll: (params) => api.get('/sermons', { params }),
//   getById: (id) => api.get(`/sermons/${id}`),
//   create: (data) => api.post('/sermons', data),
//   update: (id, data) => api.put(`/sermons/${id}`, data),
//   delete: (id) => api.delete(`/sermons/${id}`),
//   getLive: () => api.get('/sermons/live'),
// };

// // Events API
// export const eventAPI = {
//   getAll: (params) => api.get('/events', { params }),
//   getById: (id) => api.get(`/events/${id}`),
//   create: (data) => api.post('/events', data),
//   update: (id, data) => api.put(`/events/${id}`, data),
//   delete: (id) => api.delete(`/events/${id}`),
//   getUpcoming: () => api.get('/events/upcoming'),
// };

// // Giving API
// export const givingAPI = {
//   initialize: (data) => api.post('/giving/initialize', data),
//   verify: (reference) => api.post('/giving/verify', { reference }),
//   getHistory: () => api.get('/giving/history'),
//   getStats: () => api.get('/giving/stats'),
//   generateReceipt: (id) => api.get(`/giving/receipt/${id}`),
// };

// // Ministries API
// export const ministryAPI = {
//   getAll: () => api.get('/ministries'),
//   getById: (id) => api.get(`/ministries/${id}`),
//   create: (data) => api.post('/ministries', data),
//   update: (id, data) => api.put(`/ministries/${id}`, data),
//   delete: (id) => api.delete(`/ministries/${id}`),
// };

// // Users API
// export const userAPI = {
//   getProfile: () => api.get('/users/profile'),
//   updateProfile: (data) => api.put('/users/profile', data),
//   getAll: () => api.get('/users'),
//   getById: (id) => api.get(`/users/${id}`),
//   updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
// };

// // Settings API
// export const settingsAPI = {
//   getSettings: () => api.get('/settings'),
//   updateSettings: (data) => api.put('/settings', data),
// };

// export default api;


// src/services/api.js
import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'https://gog-backend-ldpl.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor - uses Firebase auth directly
api.interceptors.request.use(
  async (config) => {
    try {
      // ✅ First try to get user from Firebase
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
      
      // ✅ Fallback to localStorage if Firebase user not available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor - handles 401 without auto-redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔑 401 - Unauthorized request');
      // ✅ DON'T auto-redirect - let the component handle it
      // Just remove the token and let the user refresh
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Sermons API
export const sermonAPI = {
  getAll: (params) => api.get('/sermons', { params }),
  getById: (id) => api.get(`/sermons/${id}`),
  create: (data) => api.post('/sermons', data),
  update: (id, data) => api.put(`/sermons/${id}`, data),
  delete: (id) => api.delete(`/sermons/${id}`),
  getLive: () => api.get('/sermons/live'),
};

// Events API
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getUpcoming: () => api.get('/events/upcoming'),
  getAllEvents: (params) => api.get('/events/all', { params }),
};

// Giving API
export const givingAPI = {
  initialize: (data) => api.post('/giving/initialize', data),
  verify: (reference) => api.post('/giving/verify', { reference }),
  getHistory: () => api.get('/giving/history'),
  getStats: () => api.get('/giving/stats'),
  generateReceipt: (id) => api.get(`/giving/receipt/${id}`),
};

// Ministries API
export const ministryAPI = {
  getAll: () => api.get('/ministries'),
  getById: (id) => api.get(`/ministries/${id}`),
  create: (data) => api.post('/ministries', data),
  update: (id, data) => api.put(`/ministries/${id}`, data),
  delete: (id) => api.delete(`/ministries/${id}`),
};

// Users API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

// ✅ Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};

// Orders API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  initializePayment: (data) => api.post('/orders/initialize-payment', data),
  verifyPayment: (tx_ref) => api.get(`/orders/verify-payment/${tx_ref}`),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  updateCashPayment: (id, data) => api.put(`/orders/${id}/cash-payment`, data),
  cancelOrder: (id, data) => api.post(`/orders/${id}/cancel`, data),
  getStats: () => api.get('/orders/stats/overview'),
};

export default api;