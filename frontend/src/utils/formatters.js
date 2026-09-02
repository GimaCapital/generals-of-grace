// Formatting functions ONLY

export const formatDate = (date, format = 'MMM d, yyyy') => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount, currency = '₦') => {
  if (amount === undefined || amount === null) return `${currency}0`;
  return `${currency}${Number(amount).toLocaleString()}`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

export const formatNumber = (number) => {
  if (number === undefined || number === null) return '0';
  return Number(number).toLocaleString();
};

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatPercentage = (value, total, decimals = 1) => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(decimals)}%`;
};

export const formatAddress = (address) => {
  if (!address) return '';
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.country) parts.push(address.country);
  return parts.join(', ');
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diff / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

export const formatList = (items, separator = ', ', lastSeparator = ' and ') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(lastSeparator);
  return items.slice(0, -1).join(separator) + lastSeparator + items[items.length - 1];
};

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};