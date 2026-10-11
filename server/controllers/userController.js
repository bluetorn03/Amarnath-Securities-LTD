import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { logAudit } from '../utils/auditLogger.js';

const ALLOWED_ROLES = ['super_admin', 'compliance_officer', 'editor', 'viewer'];

/**
 * List all administrative users
 */
export async function getUsers(req, res, next) {
  try {
    const rows = await query(`
      SELECT id, email, name, role, is_active, last_login_at, failed_login_attempts, created_at, updated_at 
      FROM users 
      ORDER BY created_at ASC
    `);

    const users = rows.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: Boolean(u.is_active),
      lastLoginAt: u.last_login_at,
      failedLoginAttempts: u.failed_login_attempts,
      createdAt: u.created_at,
      updatedAt: u.updated_at
    }));

    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new administrative user (Super Admin only)
 */
export async function createUser(req, res, next) {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ success: false, error: 'Email, name, and password are required.' });
    }

    const assignedRole = role || 'editor';
    if (!ALLOWED_ROLES.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}.`
      });
    }

    const emailClean = email.toLowerCase().trim();
    const existing = await query('SELECT id FROM users WHERE email = ?', [emailClean]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'A user with this email address already exists.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = crypto.randomUUID();

    await query(
      `INSERT INTO users (id, email, password_hash, name, role, is_active)
       VALUES (?, ?, ?, ?, ?, TRUE)`,
      [id, emailClean, passwordHash, name.trim(), assignedRole]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_USER',
      entityType: 'user',
      entityId: id,
      details: { email: emailClean, name: name.trim(), role: assignedRole },
      req
    });

    res.status(201).json({
      success: true,
      message: `User '${name.trim()}' created successfully.`,
      data: { id, email: emailClean, name: name.trim(), role: assignedRole, isActive: true }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing user's name, role, or active status (Super Admin only)
 */
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, role, isActive } = req.body;

    const existing = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'User record not found.' });
    }
    const targetUser = existing[0];

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}.`
      });
    }

    // Safety check: ensure at least one active super_admin remains
    if (targetUser.role === 'super_admin' && (role !== 'super_admin' || isActive === false)) {
      const activeSuperAdmins = await query(
        'SELECT COUNT(*) as count FROM users WHERE role = "super_admin" AND is_active = TRUE AND id != ?',
        [id]
      );
      if (activeSuperAdmins[0].count === 0) {
        return res.status(403).json({
          success: false,
          error: 'Action forbidden: System requires at least one active Super Admin account.'
        });
      }
    }

    await query(
      `UPDATE users SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        is_active = COALESCE(?, is_active),
        updated_at = NOW()
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        role || null,
        isActive !== undefined ? Boolean(isActive) : null,
        id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_USER',
      entityType: 'user',
      entityId: id,
      details: { email: targetUser.email, updatedFields: { name, role, isActive } },
      req
    });

    res.json({ success: true, message: 'User updated successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Reset another user's password (Super Admin only)
 */
export async function resetUserPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long.'
      });
    }

    const existing = await query('SELECT id, email, name FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'User record not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await query(
      `UPDATE users SET
        password_hash = ?,
        failed_login_attempts = 0,
        lock_until = NULL,
        updated_at = NOW()
       WHERE id = ?`,
      [passwordHash, id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'ADMIN_RESET_PASSWORD',
      entityType: 'user',
      entityId: id,
      details: { email: existing[0].email },
      req
    });

    res.json({ success: true, message: `Password reset successfully for user '${existing[0].name}'.` });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a user account (Super Admin only)
 */
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account while logged in.' });
    }

    const existing = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Safety check: ensure at least one active super_admin remains
    if (existing[0].role === 'super_admin') {
      const activeSuperAdmins = await query(
        'SELECT COUNT(*) as count FROM users WHERE role = "super_admin" AND is_active = TRUE AND id != ?',
        [id]
      );
      if (activeSuperAdmins[0].count === 0) {
        return res.status(403).json({
          success: false,
          error: 'Action forbidden: Cannot delete the only remaining Super Admin account.'
        });
      }
    }

    await query('DELETE FROM users WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_USER',
      entityType: 'user',
      entityId: id,
      details: { email: existing[0].email, name: existing[0].name },
      req
    });

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
}
