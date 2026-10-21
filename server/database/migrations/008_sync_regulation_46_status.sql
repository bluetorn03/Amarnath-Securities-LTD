-- ==============================================================================
-- AMARNATH SECURITIES LIMITED (BSE: 538465)
-- Database Migration: 008_sync_regulation_46_status.sql
-- Purpose: Synchronize Regulation 46 compliance status with verified review status
-- ==============================================================================

-- Synchronize any clauses where review_status is 'Verified' to have public status 'Complied & Verified'
-- (except clauses that already have 'Complied & Published' or 'Continuous Statutory Compliance')
UPDATE regulation_46_clauses
SET status = 'Complied & Verified',
    updated_at = NOW()
WHERE review_status = 'Verified' 
  AND status NOT IN ('Complied & Published', 'Continuous Statutory Compliance')
  AND evidence_link IS NOT NULL 
  AND TRIM(evidence_link) != '';
