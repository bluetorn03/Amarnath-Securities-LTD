import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { config } from '../config/env.js';

/**
 * Middleware: Verify JWT and attach active user to req.user
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Authorization header missing or malformed.'
      });
    }

    const token = authHeader.substring(7).trim();
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ success: false, error: 'Invalid authentication token.' });
    }

    // Verify user exists and is active in database
    const users = await query(
      'SELECT id, email, name, role, is_active, lock_until FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'User record not found.' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'Account has been deactivated.' });
    }

    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      return res.status(403).json({
        success: false,
        error: 'Account temporarily locked due to failed login attempts. Try again later.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware: Check if authenticated user possesses any of the allowed roles
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
}

/**
 * Optional Auth: Attach user if valid token present, otherwise proceed as guest
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.substring(7).trim();
    const decoded = jwt.verify(token, config.jwt.secret);
    const users = await query(
      'SELECT id, email, name, role, is_active FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );
    if (users.length > 0) {
      req.user = users[0];
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
}
