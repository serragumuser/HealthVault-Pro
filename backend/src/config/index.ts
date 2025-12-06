/**
 * Application Configuration
 * Centralized configuration management for environment variables
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DatabaseConfig {
  url: string;
  poolSize: number;
}

interface RedisConfig {
  url: string;
  password?: string;
  tlsEnabled: boolean;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

interface AIConfig {
  serviceUrl: string;
  openaiApiKey: string;
  model: string;
  maxTokens: number;
}

interface UploadConfig {
  directory: string;
  maxFileSize: number;
  allowedFileTypes: string[];
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

interface SecurityConfig {
  bcryptSaltRounds: number;
  sessionSecret: string;
  twoFactorIssuer: string;
  twoFactorWindow: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface CORSConfig {
  origin: string;
  credentials: boolean;
}

interface LogConfig {
  level: string;
  filePath: string;
}

interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  database: DatabaseConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
  ai: AIConfig;
  upload: UploadConfig;
  email: EmailConfig;
  security: SecurityConfig;
  rateLimit: RateLimitConfig;
  cors: CORSConfig;
  log: LogConfig;
  features: {
    telemedicine: boolean;
    ai: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  database: {
    url: process.env.DATABASE_URL || '',
    poolSize: 10,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    tlsEnabled: process.env.REDIS_TLS_ENABLED === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  },

  upload: {
    directory: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || '.pdf,.jpg,.jpeg,.png,.doc,.docx').split(','),
  },

  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@healthvault.com',
  },

  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    sessionSecret: process.env.SESSION_SECRET || 'dev_session_secret',
    twoFactorIssuer: process.env.TWO_FACTOR_ISSUER || 'HealthVault Pro',
    twoFactorWindow: parseInt(process.env.TWO_FACTOR_WINDOW || '1', 10),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  log: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },

  features: {
    telemedicine: process.env.ENABLE_TELEMEDICINE === 'true',
    ai: process.env.ENABLE_AI_FEATURES === 'true',
    emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    smsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
  },
};

// Validate required configuration
const validateConfig = (): void => {
  const required = [
    'database.url',
    'jwt.secret',
  ];

  const missing: string[] = [];

  required.forEach((key) => {
    const keys = key.split('.');
    let value: any = config;
    
    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
};

// Validate on load in non-test environments
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

export default config;
