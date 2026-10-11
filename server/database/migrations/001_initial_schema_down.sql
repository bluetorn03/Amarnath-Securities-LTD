-- Rollback: 001_initial_schema_down
-- Drops all tables in correct foreign-key dependency order

DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS document_versions;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS regulation_46_clauses;
DROP TABLE IF EXISTS kmp_contacts;
DROP TABLE IF EXISTS committee_members;
DROP TABLE IF EXISTS board_committees;
DROP TABLE IF EXISTS directors;
DROP TABLE IF EXISTS company_profile;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS users;
