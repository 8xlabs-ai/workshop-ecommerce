import type { RequestHandler } from 'express';
import { nanoid } from 'nanoid';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header('x-request-id');
  req.id = incoming && /^[A-Za-z0-9_-]{8,64}$/.test(incoming) ? incoming : nanoid(16);
  res.setHeader('x-request-id', req.id);
  next();
};
