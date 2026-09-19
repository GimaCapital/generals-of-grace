// frontend\src\services\api.js
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

// // Giving API
// export const givingAPI = {
//   initialize: (data) => api.post('/giving/initialize', data),
//   verify: (reference) => api.post('/giving/verify', { reference }),
//   // getHistory: () => api.get('/giving/history'),
//   getHistory: (params) => api.get('/giving/history', { params }),
//   getStats: () => api.get('/giving/stats'),
//   generateReceipt: (id) => api.get(`/giving/receipt/${id}`),
//   getPaymentProvider: () => api.get('/giving/provider'),
//   switchPaymentProvider: (provider) => api.post('/giving/provider', { provider }),
//   getByReference: (reference) => {
//     return api.get(`/giving/reference/${reference}`);
//   }
// };

// Giving API
export const givingAPI = {
  initialize: (data) => api.post('/giving/initialize', data),
  verify: (reference) => api.post('/giving/verify', { reference }),
  getHistory: (params) => api.get('/giving/history', { params }),
  getStats: () => api.get('/giving/stats'),
  generateReceipt: (id) => api.get(`/giving/receipt/${id}`),
  getPaymentProvider: () => api.get('/giving/provider'),
  switchPaymentProvider: (provider) => api.post('/giving/provider', { provider }),
  getByReference: (reference) => {
    return api.get(`/giving/reference/${reference}`);
  },
  // ✅ NEW — verify payment directly with provider (handles both Paystack & Flutterwave)
  verifyPayment: (reference) => {
    return api.get(`/giving/verify-payment/${reference}`);
  },
  // ✅ Also added — in case any component calls it
  getUserTotal: () => api.get('/giving/user-total'),
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

// ✅ Settings API - Clean data before sending
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => {
    // ✅ Remove any nested 'data' field before sending
    let cleanData = { ...data };
    
    // ✅ If there's a 'data' field, flatten it
    if (cleanData.data && typeof cleanData.data === 'object') {
      const nested = cleanData.data;
      delete cleanData.data;
      Object.assign(cleanData, nested);
    }
    
    // ✅ REMOVE ALL METADATA FIELDS - they should NOT be sent to backend
    delete cleanData.id;
    delete cleanData.success;
    delete cleanData.message;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    delete cleanData._id;
    delete cleanData.__v;
    
    // ✅ DO NOT remove empty strings - let the backend handle them
    // If a user wants to clear a field, it should be saved as empty
    
    console.log('📤 API sending clean data:', cleanData);
    return api.put('/settings', cleanData);
  },
};

// Orders API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  initializePayment: (data) => api.post('/orders/initialize-payment', data),
  verifyPayment: (reference) => api.get(`/orders/verify-payment/${reference}`),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  updateCashPayment: (id, data) => api.put(`/orders/${id}/cash-payment`, data),
  cancelOrder: (id, data) => api.post(`/orders/${id}/cancel`, data),
  getStats: () => api.get('/orders/stats/overview'),
};

// Testimonies API
export const testimonyAPI = {
  // Public - Get approved testimonies
  getAll: (params) => api.get('/testimonies', { params }),
  
  // Public - Submit testimony
  submit: (data) => api.post('/testimonies', data),
  
  // Admin - Get all testimonies
  adminGetAll: (params) => api.get('/testimonies/admin/all', { params }),
  
  // Admin - Get pending testimonies
  adminGetPending: () => api.get('/testimonies/admin/pending'),
  
  // Admin - Get stats
  adminGetStats: () => api.get('/testimonies/admin/stats'),

   adminUpdate: (id, data) => api.put(`/testimonies/admin/${id}`, data),
  
  // Admin - Approve
  adminApprove: (id) => api.put(`/testimonies/admin/${id}/approve`),
  
  // Admin - Reject
  adminReject: (id, reason) => api.put(`/testimonies/admin/${id}/reject`, { reason }),
  
  // Admin - Delete
  adminDelete: (id) => api.delete(`/testimonies/admin/${id}`),
  
  // Admin - Toggle featured
  adminToggleFeatured: (id, featured) => api.put(`/testimonies/admin/${id}/featured`, { featured }),
};

// Books API
export const bookAPI = {
  // Public
  getAll: (params) => api.get('/books', { params }),
  getBySlug: (slug) => api.get(`/books/slug/${slug}`),
  getById: (id) => api.get(`/books/${id}`),
  
  // Admin
  adminGetAll: (params) => api.get('/books/admin/all', { params }),
  adminGetStats: () => api.get('/books/admin/stats'),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  toggleFeatured: (id, featured) => api.put(`/books/${id}/featured`, { featured }),
};

// Souls API
// export const soulsAPI = {
//   create: (data) => api.post('/souls', data),
//   getByUser: (userId) => api.get(`/souls/user/${userId}`),
//   getStats: (userId) => api.get(`/souls/stats/${userId}`),
//   delete: (id) => api.delete(`/souls/${id}`),
// };

export const soulsAPI = {
  create: (data) => api.post('/souls', data),
  getByUser: (userId) => api.get(`/souls/user/${userId}`),
  getStats: (userId) => api.get(`/souls/stats/${userId}`),
  delete: (id) => api.delete(`/souls/${id}`),
  // ✅ Admin / Pastor endpoints
  getAll: (params) => api.get('/souls/all', { params }),
  getAdminStats: () => api.get('/souls/admin-stats'),
  getLeaderboard: () => api.get('/souls/leaderboard'), 
};

// Badges API
export const badgesAPI = {
  getAll: () => api.get('/badges'),
  getByUser: (userId) => api.get(`/badges/user/${userId}`),
  getProgress: (userId) => api.get(`/badges/progress/${userId}`),
};

// Competitions API
export const competitionsAPI = {
  getAll: () => api.get('/competitions'),
  getActive: () => api.get('/competitions/active'),
  getById: (id) => api.get(`/competitions/${id}`),
  create: (data) => api.post('/competitions', data),
  update: (id, data) => api.put(`/competitions/${id}`, data),
  delete: (id) => api.delete(`/competitions/${id}`),
  join: (id, data) => api.post(`/competitions/${id}/join`, data),
  changeTeam: (id, data) => api.post(`/competitions/${id}/change-team`, data),
  getMyTeam: (id) => api.get(`/competitions/${id}/my-team`),
};

// Reward Categories API
export const rewardCategoriesAPI = {
  getAll: () => api.get('/reward-categories'),
  adminGetAll: () => api.get('/reward-categories/admin/all'),
  create: (data) => api.post('/reward-categories', data),
  update: (docId, data) => api.put(`/reward-categories/${docId}`, data),
  delete: (docId) => api.delete(`/reward-categories/${docId}`),
};

// Rewards API
export const rewardsAPI = {
  getAll: () => api.get('/rewards'),
  adminGetAll: () => api.get('/rewards/admin/all'),
  create: (data) => api.post('/rewards', data),
  update: (docId, data) => api.put(`/rewards/${docId}`, data),
  delete: (docId) => api.delete(`/rewards/${docId}`),
};

// Ranks API
export const ranksAPI = {
  getAll: () => api.get('/ranks'),
  adminGetAll: () => api.get('/ranks/admin/all'),
  create: (data) => api.post('/ranks', data),
  update: (docId, data) => api.put(`/ranks/${docId}`, data),
  delete: (docId) => api.delete(`/ranks/${docId}`),
};
export default api;