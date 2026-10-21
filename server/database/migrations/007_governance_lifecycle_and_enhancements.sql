-- Migration: 007_governance_lifecycle_and_enhancements
-- Description: Adds committee memberships column to directors, publish status to regulation 46 clauses, and backfills genuine committee memberships

-- 1. Add committee_memberships JSON column to directors
ALTER TABLE directors
  ADD COLUMN IF NOT EXISTS committee_memberships JSON NULL AFTER other_directorships;

-- 2. Add publish_status to regulation_46_clauses
ALTER TABLE regulation_46_clauses
  ADD COLUMN IF NOT EXISTS publish_status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published';

-- 3. Backfill genuine statutory committee memberships for existing directors
UPDATE directors
SET committee_memberships = JSON_ARRAY(
  JSON_OBJECT('committeeName', 'Audit Committee (Subject to Reconstitution)', 'role', 'Member'),
  JSON_OBJECT('committeeName', 'Risk Management Committee (Subject to Reconstitution)', 'role', 'Chairperson')
)
WHERE id = 'dir-amit-pandya' AND committee_memberships IS NULL;

UPDATE directors
SET committee_memberships = JSON_ARRAY(
  JSON_OBJECT('committeeName', 'Audit Committee', 'role', 'Chairperson'),
  JSON_OBJECT('committeeName', 'Nomination & Remuneration Committee', 'role', 'Member')
)
WHERE id = 'dir-sanjay-rajkumar' AND committee_memberships IS NULL;

UPDATE directors
SET committee_memberships = JSON_ARRAY(
  JSON_OBJECT('committeeName', 'Nomination & Remuneration Committee', 'role', 'Chairperson'),
  JSON_OBJECT('committeeName', 'Stakeholders Relationship Committee', 'role', 'Member')
)
WHERE id = 'dir-nitin-walunj' AND committee_memberships IS NULL;

UPDATE directors
SET committee_memberships = JSON_ARRAY(
  JSON_OBJECT('committeeName', 'Stakeholders Relationship Committee', 'role', 'Chairperson'),
  JSON_OBJECT('committeeName', 'Audit Committee', 'role', 'Member'),
  JSON_OBJECT('committeeName', 'Nomination & Remuneration Committee', 'role', 'Member')
)
WHERE id = 'dir-vaishali-mahadik' AND committee_memberships IS NULL;

UPDATE directors
SET committee_memberships = JSON_ARRAY(
  JSON_OBJECT('committeeName', 'Stakeholders Relationship Committee', 'role', 'Member')
)
WHERE id = 'dir-chetan-patel' AND committee_memberships IS NULL;
