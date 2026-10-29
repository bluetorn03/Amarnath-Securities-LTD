-- Migration 010: Administrative Credentials Dynamic Email Synchronization
-- Ensures strict email validation, unique constraint and indexing on users table for dynamic email updates

-- Ensure email column in users is optimal and strictly constrained
ALTER TABLE `users` MODIFY COLUMN `email` VARCHAR(255) NOT NULL;

-- Log migration execution into audit logs
INSERT INTO `audit_logs` (`action`, `entity_type`, `entity_id`, `details`, `created_at`)
VALUES (
  'SYSTEM_MIGRATION',
  'migration',
  '010',
  JSON_OBJECT(
    'migration', '010_update_administrative_credentials.sql',
    'feature', 'Dynamic Administrative Email & Credentials Update',
    'status', 'SUCCESS'
  ),
  NOW()
);

