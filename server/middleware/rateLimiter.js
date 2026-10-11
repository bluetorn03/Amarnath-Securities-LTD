import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

/**
 * Strict limiter for authentication routes (login / password recovery)
 * Prevents credential stuffing and brute-force attacks
 */
export const authLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxAuth,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

/**
 * Limiter for public enquiry and investor grievance submission
 * Prevents spam bots and server flooding
 */
export const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many submissions received from this IP address. Please wait before filing another request.'
  }
});

/**
 * General API Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 180, // 180 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'API rate limit exceeded. Please throttle your requests.'
  }
});
