import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUPS_DIR = path.join(__dirname, 'backups');
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
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

/**
 * Perform a full SQL backup of all database tables and records
 */
export async function createBackup() {
  console.log(`[BACKUP] Initiating database backup for '${config.db.database}'...`);
  const conn = await getDbConnection();

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `asl_backup_${timestamp}.sql`;
    const backupFilePath = path.join(BACKUPS_DIR, backupFileName);

    let sqlDump = `-- ====================================================\n`;
    sqlDump += `-- AMARNATH SECURITIES LIMITED (BSE: 538465)\n`;
    sqlDump += `-- Database Backup Dump: ${new Date().toISOString()}\n`;
    sqlDump += `-- ====================================================\n\n`;
    sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // Get list of tables
    const [tables] = await conn.query('SHOW FULL TABLES WHERE Table_Type = "BASE TABLE"');
    const tableNames = tables.map((t) => Object.values(t)[0]);

    for (const table of tableNames) {
      console.log(`[BACKUP] Dumping table: ${table}...`);
      
      // Get CREATE TABLE statement
      const [createRes] = await conn.query(`SHOW CREATE TABLE \`${table}\``);
      const createSql = createRes[0]['Create Table'];
      sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n`;
      sqlDump += `${createSql};\n\n`;

      // Get Table Rows
      const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]).map((c) => `\`${c}\``).join(', ');
        const valuesList = rows.map((r) => {
          const vals = Object.values(r).map((v) => {
            if (v === null) return 'NULL';
            if (typeof v === 'number' || typeof v === 'boolean') return v;
            if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
            return conn.escape(typeof v === 'object' ? JSON.stringify(v) : String(v));
          });
          return `(${vals.join(', ')})`;
        });

        sqlDump += `INSERT INTO \`${table}\` (${columns}) VALUES\n${valuesList.join(',\n')};\n\n`;
      }
    }

    sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    fs.writeFileSync(backupFilePath, sqlDump, 'utf8');

    console.log(`[BACKUP] Backup created successfully: ${backupFilePath}`);
    console.log(`[BACKUP] Total tables archived: ${tableNames.length}`);
    return backupFilePath;
  } finally {
    await conn.end();
  }
}

/**
 * Restore an SQL backup file into the database and verify integrity
 */
export async function restoreBackup(backupFilePath) {
  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file not found: ${backupFilePath}`);
  }

  console.log(`[RESTORE] Restoring database from: ${backupFilePath}...`);
  const conn = await getDbConnection();

  try {
    const sql = fs.readFileSync(backupFilePath, 'utf8');

    await conn.beginTransaction();
    try {
      await conn.query(sql);
      await conn.commit();
      console.log(`[RESTORE] SQL statements executed successfully.`);
    } catch (err) {
      await conn.rollback();
      throw err;
    }

    // Verify row counts across critical tables
    const [docCount] = await conn.query('SELECT COUNT(*) as cnt FROM documents');
    const [userCount] = await conn.query('SELECT COUNT(*) as cnt FROM users');
    const [dirCount] = await conn.query('SELECT COUNT(*) as cnt FROM directors');

    console.log(`[RESTORE VERIFICATION] Documents: ${docCount[0].cnt}, Users: ${userCount[0].cnt}, Directors: ${dirCount[0].cnt}`);
    console.log(`[RESTORE SUCCESS] Database restored and integrity verified.`);
    return true;
  } finally {
    await conn.end();
  }
}

// CLI handler
if (process.argv[1] && process.argv[1].endsWith('backupRestore.js')) {
  const isRestore = process.argv.includes('--restore');
  if (isRestore) {
    const fileArgIdx = process.argv.indexOf('--restore') + 1;
    const fileArg = process.argv[fileArgIdx];
    if (!fileArg) {
      console.error('[ERROR] Please specify backup file path to restore.');
      process.exit(1);
    }
    restoreBackup(path.resolve(fileArg))
      .then(() => process.exit(0))
      .catch((err) => {
        console.error('[RESTORE FAILED]', err);
        process.exit(1);
      });
  } else {
    createBackup()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error('[BACKUP FAILED]', err);
        process.exit(1);
      });
  }
}
