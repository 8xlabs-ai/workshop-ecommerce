import { type HttpInterceptorFn } from '@angular/common/http';

const newRequestId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

/** Always-on. Server-side pino logs use the `x-request-id` header to scope logs. */
export const requestIdInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'x-request-id': newRequestId() } }));
