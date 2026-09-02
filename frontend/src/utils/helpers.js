// Helper functions ONLY (no formatting functions)

export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const stringToColor = (str) => {
  if (!str) return '#C9A84C';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  const sorted = [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return aVal - bVal;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const getCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const count = Math.floor(diff / seconds);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

export const safeJsonParse = (json, fallback = null) => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const toQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = '';

  if (ua.includes('Chrome')) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Safari')) {
    browser = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Edge')) {
    browser = 'Edge';
    version = ua.match(/Edge\/(\d+)/)?.[1] || '';
  }

  return { browser, version };
};

// ✅ slugify ONLY here
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};