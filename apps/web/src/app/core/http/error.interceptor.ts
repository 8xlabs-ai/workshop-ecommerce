import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service.js';

/**
 * Centralised HTTP error handling.
 * - 401 from a logged-in call: log out + redirect to login.
 * - 401 from a public/guest call: leave alone — let the component handle it.
 * - Other errors: re-throw for component-level handling.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && auth.isAuthenticated()) {
        auth.logout();
        router.navigate(['/account/login'], { queryParams: { redirect: router.url } });
      }
      return throwError(() => err);
    }),
  );
};
