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

  // Generate cryptographically secure 20-character password
  const randomChars = crypto.randomBytes(12).toString('base64').replace(/[/+=]/g, 'x');
  const newPassword = `Asl#2026_${randomChars}!`;

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(newPassword, salt);

  const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@amarnathsecuritiesltd.com';

  const result = await query(
    'UPDATE users SET password_hash = ?, failed_login_attempts = 0, lock_until = NULL WHERE email = ?',
    [hash, email]
  );

  if (result.affectedRows === 0) {
    console.error(`[ERROR] User ${email} not found in database.`);
    process.exit(1);
  }

  // Update .env file
  const envPath = path.resolve(__dirname, '../../.env');
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

  // Remove any exposed password lines
  envContent = envContent.replace(/^#?\s*INITIAL_ADMIN_PASSWORD=.*$/gm, '');
  envContent = envContent.replace(/^#?\s*Password:.*$/gm, '');
  envContent = envContent.replace(/^#?\s*Username\/Email:.*$/gm, '');
  envContent = envContent.replace(/^#?\s*admin credentials.*$/gm, '');
  envContent = envContent.trim();

  envContent += `\n\n# Secure Initial Admin Credentials (Rotated)\nINITIAL_ADMIN_EMAIL="${email}"\nINITIAL_ADMIN_PASSWORD="${newPassword}"\n`;

  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log(`[SUCCESS] Admin password successfully rotated for ${email}!`);
  console.log(`[NOTICE] Updated .env with new secure credentials.`);
  console.log(`[NEW PASSWORD]: ${newPassword}`);
}

rotatePassword()
  .then(async () => {
    await closePool();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('[ERROR]', err);
    await closePool();
    process.exit(1);
  });
