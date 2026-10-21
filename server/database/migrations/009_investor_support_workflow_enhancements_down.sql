-- ==============================================================================
-- AMARNATH SECURITIES LIMITED (BSE: 538465)
-- Database Migration Rollback: 009_investor_support_workflow_enhancements_down.sql
-- Purpose: Rollback additions for migration 009
-- ==============================================================================

ALTER TABLE enquiries
  DROP COLUMN IF EXISTS follow_up_date,
  DROP COLUMN IF EXISTS resolution_notes,
  DROP COLUMN IF EXISTS is_archived,
  DROP COLUMN IF EXISTS assigned_to,
  DROP COLUMN IF EXISTS updated_by;
