import rateLimit from 'express-rate-limit';

/**
 * Generic rate limiter. Apply per-route to bound abuse.
 * The guest checkout endpoint MUST use this from day one.
 */
export const checkoutRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `${req.user?.id ?? req.ip}`,
  message: { error: 'RATE_LIMITED', message: 'Too many checkout attempts. Try again in a minute.' },
});

export const authRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
