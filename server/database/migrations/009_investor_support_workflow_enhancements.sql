-- ==============================================================================
-- AMARNATH SECURITIES LIMITED (BSE: 538465)
-- Database Migration: 009_investor_support_workflow_enhancements.sql
-- Purpose: Enhance enquiries table with follow-up tracking, resolution notes,
--          controlled archiving, and audit user references for Investor Support
-- ==============================================================================

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS follow_up_date VARCHAR(50) NULL,
  ADD COLUMN IF NOT EXISTS resolution_notes TEXT NULL,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS updated_by VARCHAR(36) NULL;

-- Backfill resolution_notes from existing admin_notes where available
UPDATE enquiries 
SET resolution_notes = admin_notes 
WHERE resolution_notes IS NULL AND admin_notes IS NOT NULL;

-- Backfill admin_notes from resolution_notes where available
UPDATE enquiries 
SET admin_notes = resolution_notes 
WHERE admin_notes IS NULL AND resolution_notes IS NOT NULL;
