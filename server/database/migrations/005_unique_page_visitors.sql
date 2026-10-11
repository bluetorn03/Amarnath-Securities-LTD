-- Migration: 005_unique_page_visitors
-- Description: Table for tracking deduplicated unique visitor views per public page route

CREATE TABLE IF NOT EXISTS page_unique_visitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visitor_id VARCHAR(64) NOT NULL,
  route VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  first_visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_visited_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  visit_hits INT NOT NULL DEFAULT 1,
  UNIQUE KEY uq_visitor_route (visitor_id, route),
  INDEX idx_route (route),
  INDEX idx_visitor (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure baseline routes are present in page_visits with 0 count
INSERT INTO page_visits (route, page_name, visit_count) VALUES
('home', 'Corporate Homepage', 0),
('investor-relations', 'Investor Relations Portal', 0),
('about', 'About & Leadership', 0),
('contact', 'Contact & Registered Office', 0),
('capabilities', 'Capabilities & Advisory', 0),
('insights', 'Insights & Research', 0)
ON DUPLICATE KEY UPDATE page_name = VALUES(page_name);
