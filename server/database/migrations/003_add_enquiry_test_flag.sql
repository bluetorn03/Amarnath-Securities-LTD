-- Migration: 003_add_enquiry_test_flag
-- Separates automated audit & test executions from genuine shareholder submissions

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;

-- Tag known automated testing submissions without deleting historical logs
UPDATE enquiries 
SET is_test = TRUE 
WHERE email = 'audit-client@institution.com' 
   OR name = 'Automated Audit Client' 
   OR details LIKE '%Audit test mandate submission%';
