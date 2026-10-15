import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Database settings
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'amarnath_securities',
    databaseUrl: process.env.DATABASE_URL || null,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10000,
  },

  // JWT Auth
  jwt: {
    secret: (() => {
      const s = process.env.JWT_SECRET;
      const isKnownDefault = s === 'amarnath_securities_sec_jwt_key_2026_production_grade_token_signature';
      if (process.env.NODE_ENV === 'production' && (!s || isKnownDefault)) {
        throw new Error('CRITICAL SECURITY CONFIGURATION ERROR: A custom, cryptographically secure JWT_SECRET must be defined in production. Fallback keys are prohibited.');
      }
      return s || 'amarnath_securities_sec_jwt_key_2026_dev_fallback_secret_only';
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  // Default seed credentials (only used during initial DB bootstrap if user table is empty)
  initialAdmin: {
    name: process.env.INITIAL_ADMIN_NAME || 'Amarnath Administrator',
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@amarnathsecuritiesltd.com',
    password: process.env.INITIAL_ADMIN_PASSWORD || null,
    role: 'super_admin'
  },

  // Security & Storage
  security: {
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxAuth: 10, // 10 attempts per window for login
    rateLimitMaxPublic: 100, // 100 requests per window for public endpoints
    maxUploadSizeBytes: 25 * 1024 * 1024, // 25 MB
  },

  uploadDir: path.resolve(__dirname, '../uploads'),
  
  // Encrypted Backup & Offsite Storage (Separated from JWT_SECRET)
  backup: {
    dir: path.resolve(__dirname, '../database/backups'),
    offsiteVaultDir: path.resolve(__dirname, '../database/offsite_vault'),
    // Dedicated primary key (strictly separated from JWT_SECRET)
    encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || null,
    // Candidate fallback keys to guarantee legacy backups remain accessible
    legacyFallbackKeys: [
      process.env.BACKUP_ENCRYPTION_KEY_FALLBACK,
      process.env.JWT_SECRET,
      'asl_secure_backup_key_fallback_salt'
    ].filter(Boolean),
    offsiteEnabled: process.env.BACKUP_OFFSITE_ENABLED === 'true' || Boolean(process.env.BACKUP_S3_BUCKET),
    s3Bucket: process.env.BACKUP_S3_BUCKET || null,
    s3Region: process.env.BACKUP_S3_REGION || 'ap-south-1',
    s3Endpoint: process.env.BACKUP_S3_ENDPOINT || null,
    s3AccessKeyId: process.env.BACKUP_S3_ACCESS_KEY_ID || null,
    s3SecretAccessKey: process.env.BACKUP_S3_SECRET_ACCESS_KEY || null,
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '90', 10),
    stagingDatabase: process.env.DB_STAGING_NAME || 'amarnath_securities_staging',
  },
};
