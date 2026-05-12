import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service.js';

/**
 * Adds `Authorization: Bearer <token>` to outbound requests **iff** a token
 * is in memory AND the request URL does not opt out via the
 * `X-Skip-Auth` header. Guest endpoints (`/api/checkout/guest`,
 * `/api/orders/:id?email=`) MUST opt out — the server treats them as
 * anonymous and a stale token confuses logging.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const skip = req.headers.has('X-Skip-Auth');

  if (!token || skip) {
    return next(skip ? req.clone({ headers: req.headers.delete('X-Skip-Auth') }) : req);
  }

  return next(
    req.clone({
      setHeaders: { authorization: `Bearer ${token}` },
    }),
  );
};
