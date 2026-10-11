-- Migration Down: 003_add_enquiry_test_flag

ALTER TABLE enquiries DROP COLUMN IF EXISTS is_test;
