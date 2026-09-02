const crypto = require('crypto');

const generateId = (length = 8) => {
  return crypto.randomBytes(length).toString('hex').toUpperCase().slice(0, length);
};

const generateTitheNumber = (prefix = 'GOG') => {
  const timestamp = Date.now().toString().slice(-8);
  const random = generateId(4);
  return `${prefix}-${timestamp}-${random}`;
};

const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString();
};

const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

const sanitizeObject = (obj) => {
  if (!obj) return {};
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value;
    }
  }
  return result;
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  const phoneRegex = /^(\+234|0)[0-9]{10}$/;
  return phoneRegex.test(cleaned);
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
      }
    }
  }
  throw lastError;
};

const pick = (obj, keys) => {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
};

const omit = (obj, keys) => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

module.exports = {
  generateId,
  generateTitheNumber,
  formatDate,
  isEmpty,
  sanitizeObject,
  slugify,
  isValidEmail,
  isValidPhone,
  getInitials,
  truncateText,
  sleep,
  retry,
  pick,
  omit,
};