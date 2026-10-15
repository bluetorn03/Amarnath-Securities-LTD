import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, closePool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rotatePassword() {
  console.log('[SECURITY] Initiating Admin Password Rotation...');

  // Generate cryptographically secure 24-character password
  const randomChars = crypto.randomBytes(14).toString('base64').replace(/[/+=]/g, 'x');
  const newPassword = `Asl#2026_${randomChars}!`;

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(newPassword, salt);

  const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@amarnathsecuritiesltd.com';

  const result = await query(
    'UPDATE users SET password_hash = ?, failed_login_attempts = 0, lock_until = NULL, updated_at = NOW() WHERE email = ?',
    [hash, email]
  );

  if (result.affectedRows === 0) {
    console.error(`[ERROR] User ${email} not found in database.`);
    process.exit(1);
  }

  // Update .env file
  const envPath = path.resolve(__dirname, '../../.env');
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

  // Replace existing INITIAL_ADMIN_PASSWORD line
  if (/^INITIAL_ADMIN_PASSWORD=.*$/m.test(envContent)) {
    envContent = envContent.replace(/^INITIAL_ADMIN_PASSWORD=.*$/m, `INITIAL_ADMIN_PASSWORD="${newPassword}"`);
  } else {
    envContent += `\nINITIAL_ADMIN_PASSWORD="${newPassword}"\n`;
  }

  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log(`[SECURITY SUCCESS] Admin password successfully rotated for ${email}!`);
  console.log('[SECURITY NOTICE] Updated .env and database hash with secure credentials. Passwords are never printed to logs.');
}

rotatePassword()
  .then(async () => {
    await closePool();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('[ERROR]', err.message);
    await closePool();
    process.exit(1);
  });
