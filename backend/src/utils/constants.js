// User Roles
const USER_ROLES = {
  MEMBER: 'member',
  PASTOR: 'pastor',
  ADMIN: 'admin',
};

// Giving Types
const GIVING_TYPES = {
  TITHE: 'tithe',
  OFFERING: 'offering',
  BUILDING: 'building',
  MISSION: 'mission',
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
};

// Event Types
const EVENT_TYPES = {
  SERVICE: 'service',
  CONFERENCE: 'conference',
  OUTREACH: 'outreach',
  PRAYER_MEETING: 'prayer_meeting',
};

// Event Status
const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
};

// Sermon Status
const SERMON_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Ministry Status
const MINISTRY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// Payment Methods
const PAYMENT_METHODS = {
  FLUTTERWAVE: 'flutterwave',
  BANK_TRANSFER: 'bank_transfer',
};

// Service Times
const SERVICE_TIMES = [
  { day: 'Sunday', time: '8:00 AM' },
  { day: 'Sunday', time: '10:00 AM' },
  { day: 'Wednesday', time: '6:00 PM' },
];

// Preset Giving Amounts (in NGN)
const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

module.exports = {
  USER_ROLES,
  GIVING_TYPES,
  PAYMENT_STATUS,
  EVENT_TYPES,
  EVENT_STATUS,
  SERMON_STATUS,
  MINISTRY_STATUS,
  PAYMENT_METHODS,
  SERVICE_TIMES,
  PRESET_AMOUNTS,
};