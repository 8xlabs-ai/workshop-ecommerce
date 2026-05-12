import type { Routes } from '@angular/router';

/**
 * Logged-in flow lives on `/checkout/...` (gated by authGuard at the app level).
 * Guest flow lives on `/checkout/guest/...` — same shell, no auth.
 *
 * Note: app.routes.ts maps the entire `/checkout` parent through authGuard,
 * but the guard explicitly lets `guest`-prefixed children through.
 */
export const checkoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./checkout-shell.component.js').then((m) => m.CheckoutShellComponent),
    children: [
      { path: '', redirectTo: 'address', pathMatch: 'full' },
      {
        path: 'address',
        data: { stepKey: 'address' },
        loadComponent: () =>
          import('./steps/address-step.component.js').then((m) => m.AddressStepComponent),
      },
      {
        path: 'shipping',
        data: { stepKey: 'shipping' },
        loadComponent: () =>
          import('./steps/shipping-step.component.js').then((m) => m.ShippingStepComponent),
      },
      {
        path: 'payment',
        data: { stepKey: 'payment' },
        loadComponent: () =>
          import('./steps/payment-step.component.js').then((m) => m.PaymentStepComponent),
      },
      {
        path: 'review',
        data: { stepKey: 'review' },
        loadComponent: () =>
          import('./steps/review-step.component.js').then((m) => m.ReviewStepComponent),
      },

      // Guest sub-flow — no auth, gated server-side by `guest_checkout_enabled`.
      {
        path: 'guest',
        children: [
          { path: '', redirectTo: 'contact', pathMatch: 'full' },
          {
            path: 'contact',
            data: { stepKey: 'contact', guest: true },
            loadComponent: () =>
              import('./steps/guest-contact-step.component.js').then(
                (m) => m.GuestContactStepComponent,
              ),
          },
          {
            path: 'shipping-payment',
            data: { stepKey: 'shipping-payment', guest: true },
            loadComponent: () =>
              import('./steps/guest-shipping-payment-step.component.js').then(
                (m) => m.GuestShippingPaymentStepComponent,
              ),
          },
          {
            path: 'review',
            data: { stepKey: 'review', guest: true },
            loadComponent: () =>
              import('./steps/guest-review-step.component.js').then(
                (m) => m.GuestReviewStepComponent,
              ),
          },
        ],
      },
    ],
  },
];
