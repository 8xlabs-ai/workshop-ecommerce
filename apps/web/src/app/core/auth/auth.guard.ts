import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service.js';

/**
 * **Brownfield note** — global guard on `/checkout/**` today.
 * The wall your guest slice punches a door through.
 *
 * Do NOT remove or weaken. Instead, declare a sibling route `/checkout/guest`
 * that does NOT include `canActivate: [authGuard]`, so guests step through
 * without a JWT.
 *
 * Implementation: when the guard runs on the `/checkout` PARENT and the
 * shopper is heading into a `/checkout/guest/*` URL, let them through. The
 * URL inspection uses the RouterStateSnapshot because the parent
 * ActivatedRouteSnapshot only knows its own segment ('checkout').
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (state.url.startsWith('/checkout/guest')) {
    return true;
  }

  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/account/login'], { queryParams: { redirect: state.url } });
};
