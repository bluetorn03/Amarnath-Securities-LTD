import crypto from 'crypto';
import { query } from '../config/db.js';

const SUPPORTED_PAGES = {
  home: 'Corporate Homepage',
  'investor-relations': 'Investor Relations Portal',
  about: 'About & Leadership',
  contact: 'Contact & Registered Office',
  capabilities: 'Capabilities & Advisory',
  insights: 'Insights & Research',
};

/**
 * Anonymize client IP address for privacy protection (mask host octet)
 */
function anonymizeIp(rawIp) {
  if (!rawIp) return '0.0.0.0';
  const ipStr = String(rawIp).split(',')[0].trim();
  if (ipStr === '::1' || ipStr === '::ffff:127.0.0.1' || ipStr === '127.0.0.1') {
    return '127.0.0.1';
  }
  // IPv4: mask last octet to .0
  if (ipStr.includes('.')) {
    const parts = ipStr.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  // IPv6: truncate host identifier
  if (ipStr.includes(':')) {
    const parts = ipStr.split(':');
    return `${parts.slice(0, 3).join(':')}::0`;
  }
  return '0.0.0.0';
}

function generateVisitorHash(rawIp, userAgent) {
  return crypto
    .createHash('sha256')
    .update(`${rawIp}_${userAgent}_asl_privacy_salt_2026`)
    .digest('hex')
    .slice(0, 32);
}

/**
 * Normalize incoming route path to top-level tracked section
 */
function normalizeRoute(rawRoute) {
  if (!rawRoute) return 'home';
  const clean = String(rawRoute)
    .trim()
    .replace(/^#\/?/, '')
    .replace(/^\//, '')
    .split('/')[0]
    .toLowerCase();

  if (!clean || clean === 'home') return 'home';
  if (SUPPORTED_PAGES[clean]) return clean;
  return null;
}

/**
 * Increment page visit count ONLY for new unique visitors
 * Prevents duplicates from page refreshes and re-navigation
 */
export async function recordPageVisit(req, res, next) {
  try {
    const rawRoute = req.body?.route || req.query?.route || 'home';
    const rawVisitorId = req.body?.visitorId || req.query?.visitorId || '';
    const route = normalizeRoute(rawRoute);

    if (!route || route === 'admin') {
      return res.json({ success: true, ignored: true, reason: 'Non-tracked or administrative route' });
    }

    const pageName = SUPPORTED_PAGES[route] || 'Portal Page';

    // Privacy-Preserving Telemetry: Anonymize client IP and user agent
    const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1';
    const ip = anonymizeIp(rawIp);
    const userAgent = (req.headers['user-agent'] || 'Unknown Browser').slice(0, 250);

    // Fallback pseudonymized visitor hash if client didn't supply one
    const visitorId = String(rawVisitorId || generateVisitorHash(rawIp, userAgent)).trim().slice(0, 64);

    // Check & Insert into unique visitors table
    const result = await query(
      `INSERT INTO page_unique_visitors (visitor_id, route, ip_address, user_agent)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         visit_hits = visit_hits + 1,
         last_visited_at = NOW()`,
      [visitorId, route, String(ip).slice(0, 45), String(userAgent).slice(0, 500)]
    );

    const isNewUnique = result.affectedRows === 1;

    if (isNewUnique) {
      // ONLY increment visit_count when a NEW UNIQUE VISITOR visits this page
      await query(
        `INSERT INTO page_visits (route, page_name, visit_count, last_visited_at)
         VALUES (?, ?, 1, NOW())
         ON DUPLICATE KEY UPDATE
           visit_count = visit_count + 1,
           last_visited_at = NOW()`,
        [route, pageName]
      );
    } else {
      // For existing visitor, just update timestamp without inflating visit_count
      await query(
        `UPDATE page_visits SET last_visited_at = NOW() WHERE route = ?`,
        [route]
      );
    }

    const rows = await query('SELECT * FROM page_visits WHERE route = ?', [route]);

    return res.json({
      success: true,
      route,
      pageName,
      isNewUnique,
      visitCount: Number(rows[0]?.visit_count || 0),
      lastVisitedAt: rows[0]?.last_visited_at
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Fetch live dynamic statistics from database
 * Computes live totals, unique users, page views, and timestamps
 */
export async function getPageVisits(req, res, next) {
  try {
    const rows = await query('SELECT * FROM page_visits ORDER BY visit_count DESC');

    // Aggregate unique user stats across the platform
    const [overallStats] = await query(`
      SELECT 
        COUNT(DISTINCT visitor_id) AS total_unique_users,
        COALESCE(SUM(visit_hits), 0) AS total_page_hits,
        MAX(last_visited_at) AS last_active_at
      FROM page_unique_visitors
    `);

    const totalUniqueVisits = rows.reduce((acc, curr) => acc + (Number(curr.visit_count) || 0), 0);

    const dataWithPercentages = rows.map((row) => {
      const count = Number(row.visit_count) || 0;
      const percentage = totalUniqueVisits > 0 ? Math.round((count / totalUniqueVisits) * 100) : 0;
      return {
        ...row,
        visit_count: count,
        percentage: `${percentage}%`,
        percent_raw: percentage
      };
    });

    const topPage = dataWithPercentages.find((p) => p.visit_count > 0) || dataWithPercentages[0] || null;

    res.json({
      success: true,
      data: dataWithPercentages,
      totalVisits: totalUniqueVisits,
      totalUniqueUsers: Number(overallStats?.total_unique_users || 0),
      totalPageHits: Number(overallStats?.total_page_hits || 0),
      lastActiveAt: overallStats?.last_active_at || null,
      activePages: dataWithPercentages.length,
      topPage
    });
  } catch (err) {
    next(err);
  }
}
