import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';
import { UnauthorizedError } from '../lib/errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: 'shopper' | 'admin' };
    }
  }
}

const env = loadEnv();

/**
 * Hard auth — throws 401 if no JWT.
 * **Brownfield note**: this is the wall the guest-checkout slice punches a door through.
 * Do NOT remove or weaken — narrow your guest routes around it instead.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing bearer token');
  }
  const token = header.slice('Bearer '.length);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { issuer: env.JWT_ISSUER }) as {
      sub: string;
      email: string;
      role: 'shopper' | 'admin';
    };
    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

/** Soft auth — attaches req.user if a valid token is present, otherwise continues. */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { issuer: env.JWT_ISSUER }) as {
      sub: string;
      email: string;
      role: 'shopper' | 'admin';
    };
    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
  } catch {
    // ignore — proceed as anonymous
  }
  next();
};
