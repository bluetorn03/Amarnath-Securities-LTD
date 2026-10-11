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
    secret: process.env.JWT_SECRET || 'amarnath_securities_sec_jwt_key_2026_production_grade_token_signature',
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
};
