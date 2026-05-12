import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/errors.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    req.log?.warn({ issues: err.issues }, 'validation error');
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Request body failed validation',
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof HttpError) {
    req.log?.warn({ statusCode: err.statusCode, code: err.code }, err.message);
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  req.log?.error({ err }, 'unhandled error');
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
};
