-- Migration: 002_compliance_and_system_settings
-- Description: Enhanced Regulation 46 compliance audit columns, system settings, and backup tracking

-- 1. Add compliance review fields to regulation_46_clauses
ALTER TABLE regulation_46_clauses
  ADD COLUMN IF NOT EXISTS responsible_reviewer VARCHAR(150) NULL DEFAULT 'Company Secretary & Compliance Officer',
  ADD COLUMN IF NOT EXISTS internal_review_date VARCHAR(50) NULL DEFAULT '2026-10-15',
  ADD COLUMN IF NOT EXISTS evidence_link VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS last_verified_date VARCHAR(50) NULL,
  ADD COLUMN IF NOT EXISTS compliance_notes TEXT NULL,
  ADD COLUMN IF NOT EXISTS review_status ENUM('Not Reviewed', 'Pending Evidence', 'Under Review', 'Verified', 'Not Applicable') NOT NULL DEFAULT 'Pending Evidence';

-- Update existing records to reflect current evidence state
UPDATE regulation_46_clauses 
SET review_status = 'Verified', last_verified_date = '2026-10-09'
WHERE status LIKE '%Complied%' OR status LIKE '%Continuous%';

UPDATE regulation_46_clauses 
SET review_status = 'Not Applicable'
WHERE status LIKE '%Not Applicable%';

-- 2. System Settings Table (Institutional configuration)
CREATE TABLE IF NOT EXISTS system_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  updated_by VARCHAR(36) NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_settings_category (category),
  CONSTRAINT fk_settings_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Populate default verified settings
INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('company_profile', JSON_OBJECT(
  'company_name', 'Amarnath Securities Limited',
  'cin', 'L67120GJ1994PLC023254',
  'bse_scrip_code', '538465',
  'isin', 'INE745P01010',
  'reg_office', '1/104, Sona Villa Co. Op. Hsg. Soc., 280, Bara Thakur Wad, N.G. Acharya Marg, Chembur, Mumbai - 400 071, Maharashtra, India',
  'corp_office', '1/104, Sona Villa Co. Op. Hsg. Soc., 280, Bara Thakur Wad, N.G. Acharya Marg, Chembur, Mumbai - 400 071, Maharashtra, India',
  'email', 'amarnathsecurities@gmail.com',
  'phone', '+91 22 2523 0048',
  'website', 'https://www.amarnathsecuritiesltd.com'
), 'company', 'Verified statutory identifiers and corporate office records')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('investor_relations', JSON_OBJECT(
  'compliance_officer', 'Company Secretary & Compliance Officer',
  'compliance_email', 'amarnathsecurities@gmail.com',
  'compliance_phone', '+91 22 2523 0048',
  'grievance_email', 'amarnathsecurities@gmail.com',
  'rta_name', 'Bigshare Services Pvt. Ltd.',
  'rta_address', 'Office No S6-2, 6th Floor, Pinnacle Business Park, Next to Ahura Centre, Mahakali Caves Road, Andheri (East), Mumbai - 400 093, Maharashtra',
  'rta_email', 'investor@bigshareonline.com',
  'rta_phone', '+91 22 6263 8200',
  'rta_website', 'https://www.bigshareonline.com',
  'sebi_scores_url', 'https://scores.sebi.gov.in',
  'sebi_smart_odr_url', 'https://smartodr.in',
  'bse_portal_url', 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnat/538465/'
), 'investor', 'Designated grievance redressal and Registrar details')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('security_policy', JSON_OBJECT(
  'minPasswordLength', 8,
  'requireSpecialChar', true,
  'sessionTimeoutMinutes', 480,
  'maxFailedLoginAttempts', 5,
  'lockoutDurationMinutes', 15,
  'enforceHttpsOnly', true
), 'security', 'Password policy, account lockout, and session timeout parameters')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('notifications', JSON_OBJECT(
  'emailAlertsEnabled', false,
  'adminAlertEmail', 'compliance@amarnathsecuritiesltd.com',
  'notifyOnNewGrievance', true,
  'notifyOnDocApproval', true,
  'notifyOnFailedLoginThreshold', true
), 'notifications', 'Event-driven alerting and grievance notification dispatch')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('website_seo', JSON_OBJECT(
  'metaTitle', 'Amarnath Securities Limited | BSE Listed (538465) | Capital & Corporate Advisory',
  'metaDescription', 'Amarnath Securities Limited is a BSE-listed (Scrip: 538465, CIN: L67120GJ1994PLC023254) non-banking financial services and investment advisory company.',
  'canonicalUrl', 'https://www.amarnathsecuritiesltd.com',
  'ogImage', '/amarnath-logo.png',
  'keywords', 'Amarnath Securities, BSE 538465, INE745P01010, NBFC, Investor Relations, Annual Report, Financial Results'
), 'website', 'Statutory search engine metadata and open graph tags')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('storage_settings', JSON_OBJECT(
  'maxUploadSizeBytes', 26214400,
  'maxUploadSizeMb', 25,
  'allowedFileTypes', JSON_ARRAY('PDF', 'XBRL'),
  'retentionPeriodYears', 8,
  'magicBytesValidation', true
), 'storage', 'File upload constraints, storage limits, and document retention rules')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('compliance_workflow', JSON_OBJECT(
  'defaultReviewer', 'Company Secretary & Compliance Officer',
  'defaultApprover', 'Board of Directors / Audit Committee',
  'reviewCycleDays', 90,
  'nextStatutoryReviewDate', '2026-11-15',
  'staleReviewThresholdDays', 180
), 'compliance', 'Regulation 46 review schedule and audit sign-off workflow')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- 4. Database Backups Log Table
CREATE TABLE IF NOT EXISTS system_backups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  file_size_bytes BIGINT NOT NULL,
  file_size_display VARCHAR(50) NOT NULL,
  backup_type VARCHAR(50) NOT NULL DEFAULT 'manual',
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  created_by VARCHAR(36) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_backup_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
