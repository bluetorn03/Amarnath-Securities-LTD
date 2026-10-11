import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool = null;

export function getPool() {
  if (!pool) {
    let poolOptions;
    if (config.db.databaseUrl) {
      poolOptions = {
        uri: config.db.databaseUrl,
        waitForConnections: config.db.waitForConnections,
        connectionLimit: config.db.connectionLimit,
        queueLimit: config.db.queueLimit,
        timezone: '+05:30', // Indian Standard Time
        dateStrings: true,
      };
    } else {
      poolOptions = {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        waitForConnections: config.db.waitForConnections,
        connectionLimit: config.db.connectionLimit,
        queueLimit: config.db.queueLimit,
        timezone: '+05:30',
        dateStrings: true,
      };
    }
    pool = mysql.createPool(poolOptions);
  }
  return pool;
}

/**
 * Execute a query with parameters using the connection pool
 */
export async function query(sql, params = []) {
  const p = getPool();
  const [results] = await p.query(sql, params);
  return results;
}

/**
 * Execute a transaction block with automatic rollback on error
 */
export async function transaction(callback) {
  const p = getPool();
  const connection = await p.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Check if the database connection is alive
 */
export async function checkConnection() {
  try {
    const p = getPool();
    await p.query('SELECT 1 AS ping');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message, code: err.code };
  }
}

/**
 * Gracefully close the pool
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
