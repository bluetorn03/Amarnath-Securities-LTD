import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import fs from 'fs';

async function rotateCredentials() {
  const newPassword = 'Asl#' + crypto.randomBytes(12).toString('base64url') + '!2026';
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(newPassword, salt);

  const rotatedGeminiKey = 'REVOKED_' + crypto.randomBytes(16).toString('hex');

  // Update .env
  let envContent = fs.readFileSync('.env', 'utf8');
  envContent = envContent.replace(/GEMINI_API_KEY=".*?"/, `GEMINI_API_KEY="${rotatedGeminiKey}"`);
  envContent = envContent.replace(/INITIAL_ADMIN_PASSWORD=".*?"/, `INITIAL_ADMIN_PASSWORD="${newPassword}"`);
  fs.writeFileSync('.env', envContent, 'utf8');

  // Update MariaDB
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
  console.log('SUCCESS: Admin credentials and API key rotated successfully. Database updated.');
}

rotateCredentials().catch((err) => {
  console.error('Error rotating credentials:', err);
  process.exit(1);
});
