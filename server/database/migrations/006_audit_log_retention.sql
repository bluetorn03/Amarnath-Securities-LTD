-- Migration: 006_audit_log_retention
-- Description: Regulatory audit log 1-year auto-retention policy and performance index

-- 1. Ensure performance index on created_at exists for efficient time-series purging
ALTER TABLE audit_logs 
  ADD INDEX IF NOT EXISTS idx_audit_retention (created_at);

-- 2. Execute retention purge: delete all audit logs older than 1 year (365 days)
DELETE FROM audit_logs 
WHERE created_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 YEAR);

-- 3. Record verification audit entry
INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address, user_agent, created_at)
VALUES (
  'MIGRATION_APPLIED',
  'database_schema',
  '006_audit_log_retention',
  JSON_OBJECT(
    'migration', '006_audit_log_retention.sql',
    'retentionPolicy', '1 Year (365 Days) Auto-Purge',
    'description', 'Automatic deletion of audit trails older than 1 year',
    'timestampUtc', UTC_TIMESTAMP()
  ),
  '127.0.0.1',
  'System Migration Runner',
  UTC_TIMESTAMP()
);
