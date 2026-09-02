const envalid = require('envalid');
const { str, port, num, url, bool } = envalid;

/**
 * Environment variable validation and configuration
 */
const env = envalid.cleanEnv(process.env, {
  // Server
  PORT: port({ default: 5000 }),
  NODE_ENV: str({ 
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  API_VERSION: str({ default: 'v1' }),
  API_URL: url({ default: 'http://localhost:5000' }),
  FRONTEND_URL: url({ default: 'http://localhost:3000' }),

  // Firebase
  FIREBASE_PROJECT_ID: str(),
  FIREBASE_CLIENT_EMAIL: str(),
  FIREBASE_PRIVATE_KEY: str(),
  FIREBASE_STORAGE_BUCKET: str(),
  FIREBASE_DATABASE_URL: url({ default: '' }),

  // Flutterwave
  FLUTTERWAVE_SECRET_KEY: str(),
  FLUTTERWAVE_PUBLIC_KEY: str(),
  FLUTTERWAVE_SECRET_HASH: str(),
  FLUTTERWAVE_ENCRYPTION_KEY: str({ default: '' }),

  // SendGrid
  SENDGRID_API_KEY: str(),
  EMAIL_FROM: str({ default: 'noreply@generalsofgrace.org' }),
  EMAIL_ADMIN: str({ default: 'admin@generalsofgrace.org' }),
  EMAIL_SUPPORT: str({ default: 'support@generalsofgrace.org' }),

  // JWT
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '7d' }),

  // Security
  RATE_LIMIT_WINDOW: num({ default: 15 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
  MAX_REQUEST_SIZE: str({ default: '10mb' }),

  // Logging
  LOG_LEVEL: str({ 
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
  }),
  LOG_RETENTION_DAYS: num({ default: 30 }),

  // Storage
  MAX_FILE_SIZE: num({ default: 5242880 }),
  ALLOWED_FILE_TYPES: str({ 
    default: 'image/jpeg,image/png,image/webp,video/mp4,audio/mpeg',
  }),
  STORAGE_BUCKET: str({ default: '' }),
});

module.exports = env;