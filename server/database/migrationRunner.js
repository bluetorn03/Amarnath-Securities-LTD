import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDatabaseIfNotExists() {
  const rootConn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
  });
  try {
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`[DB] Database '${config.db.database}' verified/created successfully.`);
  } finally {
    await rootConn.end();
  }
}

async function getDbConnection() {
  return await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
  });
}

export async function runMigrations() {
  await createDatabaseIfNotExists();
  const conn = await getDbConnection();

  try {
    // Ensure migrations table exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Fetch applied migrations
    const [appliedRows] = await conn.query('SELECT name FROM schema_migrations ORDER BY id ASC');
    const appliedSet = new Set(appliedRows.map((r) => r.name));

    // Get current batch number
    const [batchRows] = await conn.query('SELECT MAX(batch) as maxBatch FROM schema_migrations');
    const nextBatch = (batchRows[0].maxBatch || 0) + 1;

    // Read all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql') && !f.endsWith('_down.sql'))
      .sort();

    let count = 0;
    for (const file of files) {
      if (!appliedSet.has(file)) {
        console.log(`[MIGRATION] Applying: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');

        await conn.beginTransaction();
        try {
          await conn.query(sql);
          await conn.query('INSERT INTO schema_migrations (name, batch) VALUES (?, ?)', [file, nextBatch]);
          await conn.commit();
          console.log(`[MIGRATION] Applied: ${file} (Batch ${nextBatch})`);
          count++;
        } catch (err) {
          await conn.rollback();
          console.error(`[MIGRATION FAILED] Error applying ${file}:`, err.message);
          throw err;
        }
      }
    }

    if (count === 0) {
      console.log('[MIGRATION] Schema is up to date. No new migrations.');
    } else {
      console.log(`[MIGRATION] Successfully executed ${count} migration(s).`);
    }
  } finally {
    await conn.end();
  }
}

export async function rollbackLastBatch() {
  const conn = await getDbConnection();
  try {
    const [batchRows] = await conn.query('SELECT MAX(batch) as maxBatch FROM schema_migrations');
    const lastBatch = batchRows[0].maxBatch;

    if (!lastBatch) {
      console.log('[MIGRATION] No migrations to roll back.');
      return;
    }

    const [rows] = await conn.query('SELECT name FROM schema_migrations WHERE batch = ? ORDER BY id DESC', [lastBatch]);
    const migrationsDir = path.join(__dirname, 'migrations');

    for (const row of rows) {
      const downFile = row.name.replace(/\.sql$/, '_down.sql');
      const downPath = path.join(migrationsDir, downFile);

      if (!fs.existsSync(downPath)) {
        throw new Error(`Rollback script not found for ${row.name}: expected ${downFile}`);
      }

      console.log(`[ROLLBACK] Rolling back ${row.name} using ${downFile}...`);
      const sql = fs.readFileSync(downPath, 'utf-8');

      await conn.beginTransaction();
      try {
        await conn.query(sql);
        await conn.query('DELETE FROM schema_migrations WHERE name = ?', [row.name]);
        await conn.commit();
        console.log(`[ROLLBACK] Rolled back ${row.name}`);
      } catch (err) {
        await conn.rollback();
        throw err;
      }
    }
  } finally {
    await conn.end();
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('migrationRunner.js')) {
  const isRollback = process.argv.includes('--rollback');
  if (isRollback) {
    rollbackLastBatch()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  } else {
    runMigrations()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  }
}
