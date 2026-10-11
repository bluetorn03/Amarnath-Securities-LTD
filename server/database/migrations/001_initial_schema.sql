-- Migration: 001_initial_schema
-- Description: Core relational schema for Amarnath Securities Limited

CREATE TABLE IF NOT EXISTS schema_migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  batch INT NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1. Users table (Admin CMS authentication with RBAC)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  role ENUM('super_admin', 'compliance_officer', 'editor', 'viewer') NOT NULL DEFAULT 'editor',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at DATETIME NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  lock_until DATETIME NULL,
  reset_token_hash VARCHAR(255) NULL,
  reset_token_expires_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Audit logs (Regulatory compliance & security accountability)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NULL,
  details JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_created_at (created_at),
  INDEX idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Company Profile (Single-record or versioned statutory identity)
CREATE TABLE IF NOT EXISTS company_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cin VARCHAR(30) NOT NULL,
  bse_scrip_code VARCHAR(10) NOT NULL,
  isin VARCHAR(20) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  short_name VARCHAR(100) NOT NULL,
  tagline VARCHAR(255) NULL,
  trust_line VARCHAR(255) NULL,
  core_positioning TEXT NULL,
  founded_year VARCHAR(10) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  compliance_officer VARCHAR(150) NOT NULL,
  compliance_designation VARCHAR(150) NOT NULL,
  compliance_email VARCHAR(150) NOT NULL,
  compliance_phone VARCHAR(50) NOT NULL,
  reg_office TEXT NOT NULL,
  corp_office TEXT NOT NULL,
  rta_name VARCHAR(150) NOT NULL,
  rta_historical_liaison VARCHAR(150) NULL,
  rta_address TEXT NOT NULL,
  rta_email VARCHAR(150) NOT NULL,
  rta_phone VARCHAR(50) NOT NULL,
  rta_website VARCHAR(255) NOT NULL,
  sebi_scores_url VARCHAR(255) NOT NULL,
  sebi_smart_odr_url VARCHAR(255) NOT NULL,
  bse_portal_url VARCHAR(255) NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(36) NULL,
  CONSTRAINT fk_company_profile_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Board of Directors
CREATE TABLE IF NOT EXISTS directors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  din VARCHAR(100) NOT NULL,
  appointment_date VARCHAR(100) NULL,
  term VARCHAR(150) NULL,
  bio TEXT NOT NULL,
  other_directorships JSON NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  approval_status VARCHAR(200) NOT NULL DEFAULT 'Subject to Company / CS Confirmation',
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('draft', 'review', 'published', 'archived') NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_directors_status (status),
  INDEX idx_directors_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Board Committees
CREATE TABLE IF NOT EXISTS board_committees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  short_name VARCHAR(100) NOT NULL,
  mandate TEXT NOT NULL,
  composition_rule TEXT NOT NULL,
  statutory_reference VARCHAR(255) NOT NULL,
  chairperson_name VARCHAR(150) NOT NULL,
  chairperson_designation VARCHAR(150) NOT NULL,
  chairperson_role VARCHAR(50) NOT NULL DEFAULT 'Chairperson',
  chairperson_category VARCHAR(50) NOT NULL,
  meetings_frequency VARCHAR(255) NOT NULL,
  key_responsibilities JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('draft', 'review', 'published', 'archived') NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_committees_status (status),
  INDEX idx_committees_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Committee Members
CREATE TABLE IF NOT EXISTS committee_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  committee_id VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(150) NOT NULL,
  role ENUM('Chairperson', 'Member') NOT NULL DEFAULT 'Member',
  category VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_comm_members_comm FOREIGN KEY (committee_id) REFERENCES board_committees(id) ON DELETE CASCADE,
  INDEX idx_comm_members_comm (committee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Key Managerial Personnel (KMP)
CREATE TABLE IF NOT EXISTS kmp_contacts (
  id VARCHAR(50) PRIMARY KEY,
  role_title VARCHAR(150) NOT NULL,
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  authority_scope TEXT NOT NULL,
  statutory_reference VARCHAR(255) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('draft', 'review', 'published', 'archived') NOT NULL DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kmp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Regulation 46 Clauses (SEBI LODR Master Index)
CREATE TABLE IF NOT EXISTS regulation_46_clauses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clause VARCHAR(30) NOT NULL UNIQUE,
  sub_regulation VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  requirement TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  website_location VARCHAR(200) NOT NULL,
  target_route VARCHAR(150) NOT NULL,
  target_category VARCHAR(100) NULL,
  status VARCHAR(150) NOT NULL DEFAULT 'Company/CS Confirmation Required',
  action_text VARCHAR(100) NOT NULL,
  legal_citation VARCHAR(200) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reg46_clause (clause),
  INDEX idx_reg46_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Statutory Documents Library
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  financial_year VARCHAR(30) NOT NULL,
  quarter VARCHAR(30) NOT NULL DEFAULT 'N/A',
  filing_date VARCHAR(50) NOT NULL,
  bse_ack_number VARCHAR(100) NOT NULL,
  file_size VARCHAR(30) NOT NULL,
  file_type ENUM('PDF', 'XBRL') NOT NULL DEFAULT 'PDF',
  description TEXT NOT NULL,
  source_type ENUM('upload', 'file_url', 'external_url') NOT NULL DEFAULT 'upload',
  file_url VARCHAR(500) NULL,
  external_url VARCHAR(500) NULL,
  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  sebi_reference VARCHAR(255) NULL,
  effective_date VARCHAR(100) NULL,
  version VARCHAR(30) NOT NULL DEFAULT 'Version 1.0',
  is_statutory BOOLEAN NOT NULL DEFAULT TRUE,
  status ENUM('draft', 'review', 'published', 'archived') NOT NULL DEFAULT 'published',
  created_by VARCHAR(36) NULL,
  updated_by VARCHAR(36) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_docs_category (category),
  INDEX idx_docs_year (financial_year),
  INDEX idx_docs_status (status),
  CONSTRAINT fk_docs_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_docs_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Document Version History (Audit trail for statutory uploads)
CREATE TABLE IF NOT EXISTS document_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id VARCHAR(100) NOT NULL,
  version VARCHAR(30) NOT NULL,
  file_url VARCHAR(500) NULL,
  file_size VARCHAR(30) NULL,
  source_type ENUM('upload', 'file_url', 'external_url') NOT NULL DEFAULT 'upload',
  change_summary TEXT NULL,
  created_by VARCHAR(36) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_doc_vers_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  CONSTRAINT fk_doc_vers_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_doc_vers_doc (document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Enquiries and Investor Grievances (Contact Form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(50) PRIMARY KEY,
  reference_no VARCHAR(50) NOT NULL UNIQUE,
  type ENUM('business', 'investor') NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NULL,
  company_name VARCHAR(150) NULL,
  service_interest VARCHAR(150) NULL,
  estimated_capital VARCHAR(100) NULL,
  folio_or_dp_id VARCHAR(100) NULL,
  grievance_category VARCHAR(150) NULL,
  details TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'new',
  admin_notes TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enq_type (type),
  INDEX idx_enq_status (status),
  INDEX idx_enq_ref (reference_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
