-- Rollback Migration: 007_governance_lifecycle_and_enhancements_down
-- Description: Safely drops added columns if rolled back

ALTER TABLE directors DROP COLUMN IF EXISTS committee_memberships;
ALTER TABLE regulation_46_clauses DROP COLUMN IF EXISTS publish_status;
