-- Rollback migration: 002_compliance_and_system_settings

DROP TABLE IF EXISTS system_backups;
DROP TABLE IF EXISTS system_settings;

ALTER TABLE regulation_46_clauses
  DROP COLUMN IF EXISTS responsible_reviewer,
  DROP COLUMN IF EXISTS internal_review_date,
  DROP COLUMN IF EXISTS evidence_link,
  DROP COLUMN IF EXISTS last_verified_date,
  DROP COLUMN IF EXISTS compliance_notes,
  DROP COLUMN IF EXISTS review_status;
