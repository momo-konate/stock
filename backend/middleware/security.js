/**
 * Configuration des middlewares de sécurité
 */

import rateLimit from "express-rate-limit";
import { CONFIG } from "../config/constants.js";

// Global rate limiter
export const globalLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.GLOBAL.windowMs,
  max: CONFIG.RATE_LIMIT.GLOBAL.max,
  message: CONFIG.MESSAGES.RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter
export const authLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.AUTH.windowMs,
  max: CONFIG.RATE_LIMIT.AUTH.max,
  message: CONFIG.MESSAGES.RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
