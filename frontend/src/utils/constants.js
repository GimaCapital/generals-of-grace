/**
 * Application constants
 */

// Church Information
export const CHURCH_INFO = {
  name: 'Generals of Grace Intl Church',
  shortName: 'Generals of Grace',
  acronym: 'GOG',
  email: 'info@generalsofgrace.org',
  phone: '+234 800 000 0000',
  address: '123 Church Road, Port Harcourt, Rivers State, Nigeria',
  website: 'https://generalsofgrace.org',
  social: {
    facebook: 'https://facebook.com/generalsofgrace',
    twitter: 'https://twitter.com/generalsofgrace',
    instagram: 'https://instagram.com/generalsofgrace',
    youtube: 'https://youtube.com/generalsofgrace',
  },
};

// Giving Types
export const GIVING_TYPES = [
  { id: 'tithe', label: 'Tithe', icon: 'Heart' },
  { id: 'offering', label: 'Offering', icon: 'Wallet' },
  { id: 'building', label: 'Building Fund', icon: 'CreditCard' },
  { id: 'mission', label: 'Missions', icon: 'CheckCircle' },
];

// Event Types
export const EVENT_TYPES = [
  { id: 'service', label: 'Service' },
  { id: 'conference', label: 'Conference' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'prayer_meeting', label: 'Prayer Meeting' },
];

// Sermon Categories
export const SERMON_CATEGORIES = [
  'All',
  'Grace',
  'Faith',
  'Prayer',
  'Leadership',
  'Worship',
  'Salvation',
  'Healing',
  'Deliverance',
  'Prosperity',
];

// User Roles
export const USER_ROLES = {
  MEMBER: 'member',
  PASTOR: 'pastor',
  ADMIN: 'admin',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SERMONS: {
    BASE: '/sermons',
    LIVE: '/sermons/live',
  },
  EVENTS: {
    BASE: '/events',
    UPCOMING: '/events/upcoming',
  },
  GIVING: {
    BASE: '/giving',
    INITIALIZE: '/giving/initialize',
    VERIFY: '/giving/verify',
    HISTORY: '/giving/history',
    STATS: '/giving/stats',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
  MINISTRIES: '/ministries',
  MEDIA: '/media',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
  FONT_SIZE: 'fontSize',
  NOTIFICATIONS: 'notifications',
  GIVING_HISTORY: 'givingHistory',
};

// Default Pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

// Preset Amounts for Giving
export const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

// Service Times
export const SERVICE_TIMES = [
  { day: 'Sunday', time: '8:00 AM' },
  { day: 'Sunday', time: '10:00 AM' },
  { day: 'Wednesday', time: '6:00 PM' },
];

// Navigation Links
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/sermons', label: 'Sermons' },
  { path: '/events', label: 'Events' },
  { path: '/ministries', label: 'Ministries' },
  { path: '/give', label: 'Give' },
  { path: '/contact', label: 'Contact' },
];

// Admin Navigation Links
export const ADMIN_NAV_LINKS = [
  { path: '/admin', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/admin/sermons', label: 'Sermons', icon: 'VideoLibrary' },
  { path: '/admin/events', label: 'Events', icon: 'Event' },
  { path: '/admin/giving', label: 'Giving', icon: 'Payments' },
  { path: '/admin/users', label: 'Users', icon: 'People' },
  { path: '/admin/settings', label: 'Settings', icon: 'Settings' },
];