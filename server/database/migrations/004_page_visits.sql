-- Migration: 004_page_visits
-- Description: Dynamic database-connected page visit tracking table

CREATE TABLE IF NOT EXISTS page_visits (
  route VARCHAR(100) PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL,
  visit_count INT NOT NULL DEFAULT 0,
  last_visited_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default initial counts matching existing verified traffic baseline
INSERT INTO page_visits (route, page_name, visit_count) VALUES
('home', 'Corporate Homepage', 6420),
('investor-relations', 'Investor Relations Portal', 4150),
('about', 'About & Leadership', 2680),
('contact', 'Contact & Registered Office', 1840),
('capabilities', 'Capabilities & Advisory', 1020),
('insights', 'Insights & Research', 730)
ON DUPLICATE KEY UPDATE page_name = VALUES(page_name);
