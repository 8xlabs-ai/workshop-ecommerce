export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(409, message, 'CONFLICT', details);
  }
}

export class FeatureDisabledError extends HttpError {
  constructor(flagName: string) {
    super(403, `Feature ${flagName} is not enabled`, 'FEATURE_DISABLED');
  }
}

export class PaymentDeclinedError extends HttpError {
  constructor(reason: string) {
    super(402, `Payment declined: ${reason}`, 'PAYMENT_DECLINED');
  }
}

export class RateLimitError extends HttpError {
  constructor() {
    super(429, 'Too many requests', 'RATE_LIMITED');
  }
}
