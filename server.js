import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './server/config/env.js';
import apiRouter from './server/routes/index.js';
import { apiLimiter } from './server/middleware/rateLimiter.js';
import { errorHandler } from './server/middleware/errorHandler.js';
import { startAuditRetentionScheduler } from './server/utils/auditLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || config.port || 3000;

// Trust proxy for reverse proxies (Hostinger / Nginx / Cloudflare)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // SPA loads inline fonts and local icons
  crossOriginEmbedderPolicy: false
}));

// CORS policy
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Mount API routes with rate limiting
app.use('/api', apiLimiter, apiRouter);

// Serve uploads directory directly with no-sniff headers if authorized or public
app.use('/uploads', express.static(config.uploadDir, {
  dotfiles: 'deny',
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
  }
}));

// Serve static assets from dist folder with long cache
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
  maxAge: '1y',
  immutable: true
}));

// Serve other static files (favicons, logos, robots.txt, etc.)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: send index.html for all non-static GET routes with cache-busting headers
app.get('*', (req, res, next) => {
  // If an API route wasn't matched, return 404 JSON instead of HTML
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found.' });
  }
  
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Centralized error handling middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Amarnath Securities production server running on port ${PORT} [Env: ${config.nodeEnv}]`);
  startAuditRetentionScheduler();
});

export default app;
