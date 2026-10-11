import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { config } from '../config/env.js';
import { logAudit } from '../utils/auditLogger.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    const user = users[0];

    // Check account active status
    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'This administrative account has been deactivated.' });
    }

    // Check account lockout
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      const minutesRemaining = Math.ceil((new Date(user.lock_until) - new Date()) / 60000);
      return res.status(403).json({
        success: false,
        error: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute(s).`
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockUntil = null;
      if (failedAttempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }

      await query(
        'UPDATE users SET failed_login_attempts = ?, lock_until = ? WHERE id = ?',
        [failedAttempts, lockUntil, user.id]
      );

      await logAudit({
        userId: user.id,
        action: 'FAILED_LOGIN',
        entityType: 'user',
        entityId: user.id,
        details: { attempts: failedAttempts },
        req
      });

      return res.status(401).json({
        success: false,
        error: failedAttempts >= 5
          ? 'Maximum login attempts exceeded. Account locked for 15 minutes.'
          : 'Invalid email address or password.'
      });
    }

    // Reset failed login attempts and update last_login_at
    await query(
      'UPDATE users SET failed_login_attempts = 0, lock_until = NULL, last_login_at = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate signed JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    await logAudit({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      details: { role: user.role },
      req
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLoginAt: user.last_login_at
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = req.user;
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLoginAt: user.last_login_at
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 10) {
      return res.status(400).json({ success: false, error: 'New password must be at least 10 characters long.' });
    }

    const users = await query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    await logAudit({
      userId: req.user.id,
      action: 'CHANGE_PASSWORD',
      entityType: 'user',
      entityId: req.user.id,
      req
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const users = await query('SELECT id, email, is_active FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    // Always return success message to prevent user enumeration
    if (users.length === 0 || !users[0].is_active) {
      return res.json({
        success: true,
        message: 'If the administrative email exists, a password reset authorization code has been generated.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      'UPDATE users SET reset_token_hash = ?, reset_token_expires_at = ? WHERE id = ?',
      [resetHash, expiresAt, users[0].id]
    );

    await logAudit({
      userId: users[0].id,
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'user',
      entityId: users[0].id,
      req
    });

    res.json({
      success: true,
      message: 'If the administrative email exists, a password reset authorization code has been generated.',
      // In development mode only, provide the token for verification
      ...(config.nodeEnv === 'development' ? { devResetToken: resetToken } : {})
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 10) {
      return res.status(400).json({ success: false, error: 'New password must be at least 10 characters long.' });
    }

    const resetHash = crypto.createHash('sha256').update(token).digest('hex');
    const users = await query(
      'SELECT id FROM users WHERE reset_token_hash = ? AND reset_token_expires_at > NOW() AND is_active = TRUE',
      [resetHash]
    );

    if (users.length === 0) {
      return res.status(400).json({ success: false, error: 'Password reset token is invalid or has expired.' });
    }

    const user = users[0];
    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query(
      'UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE id = ?',
      [newHash, user.id]
    );

    await logAudit({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'user',
      entityId: user.id,
      req
    });

    res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
  } catch (err) {
    next(err);
  }
}
