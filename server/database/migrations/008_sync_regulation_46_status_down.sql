-- ==============================================================================
-- AMARNATH SECURITIES LIMITED (BSE: 538465)
-- Database Migration Rollback: 008_sync_regulation_46_status_down.sql
-- Purpose: Rollback status synchronization for migration 008
-- ==============================================================================

UPDATE regulation_46_clauses
SET status = 'Company/CS Confirmation Required',
    updated_at = NOW()
WHERE clause = '46(2)(aa)' AND status = 'Complied & Verified';
