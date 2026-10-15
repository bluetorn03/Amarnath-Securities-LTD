import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function rotateCredentials() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('[ERROR] .env file not found.');
    process.exit(1);
  }

  // 1. Generate secure admin credentials and salts
  const newPassword = 'Asl#' + crypto.randomBytes(12).toString('base64url') + '!2026';
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(newPassword, salt);

  // 2. Generate secure JWT secret (512-bit / 64-byte hex)
  const newJwtSecret = crypto.randomBytes(64).toString('hex');
  const rotatedGeminiKey = 'REVOKED_' + crypto.randomBytes(16).toString('hex');

  // 3. Update .env securely
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/GEMINI_API_KEY=".*?"/, `GEMINI_API_KEY="${rotatedGeminiKey}"`);
  envContent = envContent.replace(/INITIAL_ADMIN_PASSWORD=".*?"/, `INITIAL_ADMIN_PASSWORD="${newPassword}"`);
  if (/^JWT_SECRET=.*$/m.test(envContent)) {
    envContent = envContent.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET="${newJwtSecret}"`);
  } else {
    envContent += `\nJWT_SECRET="${newJwtSecret}"\n`;
  }
  fs.writeFileSync(envPath, envContent, 'utf8');

  // 4. Update MariaDB admin user hash
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amarnath_securities'
  });

  const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', ['admin@amarnathsecuritiesltd.com']);
  const userId = rows.length > 0 ? rows[0].id : null;

  await connection.execute(
    'UPDATE users SET password_hash = ?, failed_login_attempts = 0, lock_until = NULL, updated_at = NOW() WHERE email = ?',
    [hash, 'admin@amarnathsecuritiesltd.com']
  );

  await connection.execute(
    'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [userId, 'SECURITY_CREDENTIAL_ROTATION', 'USER', userId, JSON.stringify({ reason: 'Compromised credential rotation per audit instruction', rotatedAt: new Date().toISOString() }), '127.0.0.1']
  );

  await connection.end();
  console.log('[SECURITY SUCCESS] Admin credentials and JWT secret rotated successfully. Database updated. Secrets kept confidential.');
}

rotateCredentials().catch((err) => {
  console.error('[SECURITY ERROR] Failed to rotate credentials:', err.message);
  process.exit(1);
});
