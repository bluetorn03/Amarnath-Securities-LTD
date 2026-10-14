-- Rollback: 006_audit_log_retention_down
-- Description: Revert retention index and cleanup migration record

ALTER TABLE audit_logs DROP INDEX IF EXISTS idx_audit_retention;

DELETE FROM audit_logs 
WHERE action = 'MIGRATION_APPLIED' AND entity_id = '006_audit_log_retention';
