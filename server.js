import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './server/config/env.js';
import { query } from './server/config/db.js';
import jwt from 'jsonwebtoken';
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

// Whitelist authorized origins
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://amarnathsecuritiesltd.com',
  'https://www.amarnathsecuritiesltd.com'
]);
if (process.env.APP_URL) {
  try {
    allowedOrigins.add(new URL(process.env.APP_URL).origin);
  } catch {}
}

// Security Headers with strict Content-Security-Policy & Anti-Clickjacking
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: [
        "'self'",
        'http://localhost:*',
        'http://127.0.0.1:*',
        'https://amarnathsecuritiesltd.com',
        'https://www.amarnathsecuritiesltd.com'
      ],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Hardened CORS policy: strictly validates request origin
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, tests, and same-origin requests (origin is undefined)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: Origin '${origin}' is not permitted by Amarnath Securities security policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Mount API routes with rate limiting
app.use('/api', apiLimiter, apiRouter);

// Strict JSON 404 handler for all unmatched API endpoints (prevents HTML fallback)
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API endpoint '${req.method} ${req.originalUrl}' not found.` });
});

// Access-controlled document uploads serving
app.use('/uploads', async (req, res, next) => {
  if (req.path === '/' || req.path === '') {
    return res.status(403).json({ success: false, error: 'Direct directory listing is forbidden.' });
  }

  if (req.path.includes('..')) {
    return res.status(400).json({ success: false, error: 'Path traversal detected.' });
  }

  const safeFilename = path.basename(req.path);
  try {
    const docRows = await query('SELECT status FROM documents WHERE file_url LIKE ?', [`%${safeFilename}`]);
    if (docRows.length > 0 && docRows[0].status !== 'published') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: This regulatory filing is unpublished or archived and requires administrative authorization.'
        });
      }
      try {
        jwt.verify(authHeader.substring(7).trim(), config.jwt.secret);
      } catch {
        return res.status(401).json({ success: false, error: 'Invalid or expired session.' });
      }
    }
  } catch {
    // Proceed if document table query is unavailable
  }
  next();
}, express.static(config.uploadDir, {
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
  // If an API or uploads route wasn't matched, return 404 JSON instead of HTML
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ success: false, error: 'Resource not found.' });
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
