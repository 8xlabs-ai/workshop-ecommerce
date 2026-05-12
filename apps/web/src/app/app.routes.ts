import type { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard.js';

/**
 * **Brownfield note** — AuthGuard wraps the entire `/checkout` parent today.
 * Your guest slice should add a sibling route `/checkout/guest` that does NOT
 * apply authGuard, so guests can step through it without a JWT.
 */
export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./catalog/catalog-page.component.js').then((m) => m.CatalogPageComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./catalog/product-detail.component.js').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart-page.component.js').then((m) => m.CartPageComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadChildren: () => import('./checkout/checkout.routes.js').then((m) => m.checkoutRoutes),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./orders/order-confirmation.component.js').then((m) => m.OrderConfirmationComponent),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.routes.js').then((m) => m.accountRoutes),
  },
  { path: '**', redirectTo: '' },
];
