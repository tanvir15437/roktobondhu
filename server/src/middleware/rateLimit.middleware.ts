import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 authentication attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

export const createRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15, // 15 blood requests created per 10 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many emergency requests submitted, please try again in a few minutes.',
  },
});
